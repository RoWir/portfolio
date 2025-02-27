import { ChangeEvent, FC, FormEvent, KeyboardEvent, useContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./Terminal.css"
import { FaCircle } from "react-icons/fa";
import { TerminalFunction } from "./terminalfunction/_types";
import { FileSystemContext } from "./FileSystemContext";

const Terminal: FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [userInput, setUserInput] = useState("");
    const [inputHistory, setInputHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number|null>(null);
    const [filteredAutocompleteSuggestions, setFilteredAutocompleteSuggestions] = useState<string[]>([]);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
    const [autocompleteIndex, setAutocompleteIndex] = useState<number>(0);

    const fileSystem = useContext(FileSystemContext);
    
    const commandImports: Record<string, { 
        default: TerminalFunction
    }> = import.meta.glob("/src/components/terminal/terminalfunction/*.tsx", { eager: true });
    
    const commandList = useMemo(() => {
        if (!fileSystem) return [];
        
        return Object.entries(commandImports)
            .filter(([path]) => !path.includes('_types.tsx'))
            .map(([path, mod]) => {
                const componentName = path.split('/').pop() ?? path;
                const CommandComponent = mod.default;
                return {
                    func: CommandComponent,
                    name: componentName.replace(/\.[^/.]+$/, ''),
                    autoCompleteValues: CommandComponent.autoCompleteValues?.(fileSystem) ?? [[]]
                };
            });
    }, [fileSystem]);

    useEffect(() => {
        if (commandList.length > 0) {
            setAutocompleteSuggestions(commandList.map(command => command.name));
        }
    }, [commandList]);

    useEffect(() => {
        const currentWord = userInput.split(' ')[userInput.split(' ').length-1];
        setFilteredAutocompleteSuggestions(
            autocompleteSuggestions?.filter(word => word.startsWith(currentWord))
        );
    }, [autocompleteSuggestions, userInput]);

    const addToInputHistory = useCallback((input: string) => {
        setInputHistory(prev => [...prev, input]);
    }, []);

    const handleCommand = useCallback((input: string) => {
        if (!fileSystem) return;
        
        const { addToCommandLog } = fileSystem;
        let commandFound = false;
        const commandName = input.split(" ")[0];
        
        const command = commandList.find(cmd => cmd.name === commandName);
        if (command && input !== "") {
            commandFound = true;
            const ComponentName = command.func;
            addToCommandLog(
                <ComponentName 
                    userInput={input}  
                    setUserInput={setUserInput}
                    setAutocompleteSuggestions={setAutocompleteSuggestions}
                />, 
                ''
            );
        }
        
        if (!commandFound && input !== "") {
            addToCommandLog(`Der Befehl: '${input}' konnte nicht gefunden werden`, '');
        }
    }, [commandList, fileSystem]);

    const updateAutocompleteSuggestions = useCallback((input: string) => {
        const inputParts = input.split(' ');
        
        if (inputParts.length === 1) {
            setAutocompleteSuggestions(commandList.map(command => command.name));
        } else {
            const currentFunctionName = inputParts[0];
            const commandIndex = commandList.findIndex(command => command.name === currentFunctionName);
            
            if (commandIndex !== -1) {
                const autoCompleteValues = commandList[commandIndex].autoCompleteValues;
                const suggestionIndex = inputParts.length - 2;
                
                if (autoCompleteValues.length > suggestionIndex) {
                    setAutocompleteSuggestions(autoCompleteValues[suggestionIndex]);
                }
            }
        }
    }, [commandList]);

    const onMessageSent = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (!fileSystem) return;
        
        const { addToCommandLog, getCurrentPrefix } = fileSystem;
        addToCommandLog(userInput, getCurrentPrefix());
        addToInputHistory(userInput);
        setHistoryIndex(null);
        
        handleCommand(userInput);
        setUserInput("");
    }, [userInput, fileSystem, addToInputHistory, handleCommand]);

    const onTerminalInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setUserInput(inputValue);
        updateAutocompleteSuggestions(inputValue);
        
        if (inputValue.length === 0) {
            setFilteredAutocompleteSuggestions(autocompleteSuggestions);
            return;
        }
        
        const currentWord = inputValue.split(' ')[inputValue.split(' ').length-1];
        setFilteredAutocompleteSuggestions(
            autocompleteSuggestions?.filter(word => word.startsWith(currentWord))
        );
        setAutocompleteIndex(0);
    }, [autocompleteSuggestions, updateAutocompleteSuggestions]);

    const onTerminalClick = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const onTerminalInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'ArrowUp') {
            if (inputHistory.length > 0) {
                const newHistoryIndex = historyIndex === null ? inputHistory.length - 1 : Math.max(0, historyIndex - 1);
                setUserInput(inputHistory[newHistoryIndex]);
                setHistoryIndex(newHistoryIndex);
            }
        } else if (event.code === 'ArrowDown') {
            if (inputHistory.length > 0 && historyIndex !== null) {
                const newHistoryIndex = historyIndex + 1;
                if (newHistoryIndex < inputHistory.length) {
                    setUserInput(inputHistory[newHistoryIndex]);
                    setHistoryIndex(newHistoryIndex);
                } else {
                    setUserInput("");
                    setHistoryIndex(null);
                }
            }
        } else if (event.code === 'Tab') {
            event.preventDefault();
            
            if (filteredAutocompleteSuggestions.length > 0) {
                const inputParts = userInput.split(' ');
                inputParts[inputParts.length - 1] = filteredAutocompleteSuggestions[autocompleteIndex];
                setUserInput(inputParts.join(' '));
                
                setAutocompleteIndex(prev => 
                    prev + 1 < filteredAutocompleteSuggestions.length ? prev + 1 : 0
                );
            }
        }
    }, [inputHistory, historyIndex, filteredAutocompleteSuggestions, autocompleteIndex, userInput]);

    if (!fileSystem) {
        return <div>Error with loading Filesystem Context</div>;
    }
    
    const { commandLog, getCurrentPrefix } = fileSystem;

    return (
        <div className="terminalWrap">
            <div className="terminalHeadbar">
                <div className="terminalHeaderActions">
                    <FaCircle color="red" />
                    <FaCircle color="orange" />
                    <FaCircle color="lightgreen" />
                </div>
                <div className="terminalName">
                    The Terminal
                </div>
            </div>
            <div className="terminalBody" onClick={onTerminalClick}>
                {commandLog.map((command, index) => (
                    <span key={index}>{command.prefix}{command.message}</span>
                ))}
                <span className="terminalInputWrap">
                    {getCurrentPrefix()}
                    <form className="terminalInputForm" onSubmit={onMessageSent}>
                        <input 
                            type="text" 
                            className="terminalInput"
                            value={userInput}
                            onChange={onTerminalInputChange}
                            ref={inputRef}
                            onKeyDown={onTerminalInputKeyDown}
                        />
                        <button style={{ width: 0 }} hidden></button>
                    </form>
                </span>
            </div>
        </div>
    );
}

export default Terminal;