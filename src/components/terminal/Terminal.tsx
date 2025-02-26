import { ChangeEvent, FC, FormEvent, KeyboardEvent, useContext, useRef, useState } from "react";
import "./Terminal.css"
import { FaCircle } from "react-icons/fa";
import { TerminalFunction } from "./terminalfunction/_types";
import { FileSystemContext } from "./FileSystemContext";

// interface TerminalProps {
    
// }

const Terminal: FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    
    const [userInput, setUserInput] = useState("");
    const [inputHistory, setInputHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number|null>(null);

    const fileSystem = useContext(FileSystemContext);
    if (!fileSystem) return (<div>Error with loading Filesystem Context</div>);

    const {addToCommandLog, commandLog, getCurrentPrefix } = fileSystem; 

    const addToInputHistory = (input:string) => {
        setInputHistory(prevState => ([...prevState, input]));
    }

    const onMessageSent = (e:FormEvent) => {
        e.preventDefault();
        addToCommandLog(userInput, getCurrentPrefix());
        addToInputHistory(userInput);
        setHistoryIndex(null);

        const commandImports: Record<string, { default: TerminalFunction }> = import.meta.glob("/src/components/terminal/terminalfunction/*.tsx", { eager: true });
        const commandList:{ func: TerminalFunction, name: string|undefined }[] = Object.entries(commandImports)
            .filter((path) => !path[0].includes('_types.tsx'))
            .map(([path, mod]) => {
            const fileName = path.split('/').pop();
            return {
                func: mod.default,
                name: fileName?.replace(/\.[^/.]+$/, '')
            };
        });

        var commandFound = false;
        commandList.forEach(command => {
            if (command.name === userInput.split(" ")[0]) {
                commandFound = true;
                const ComponentName: TerminalFunction = command.func
                 
                addToCommandLog(
                    <ComponentName 
                        userInput={userInput}  
                        setUserInput={setUserInput} 
                    />, ''
                );
            }
        });
        
        if (!commandFound && userInput !== "") {
            addToCommandLog("Der Befehl: '" + userInput + "' konnte nicht gefunden werden", '');
        }

        setUserInput("");
    }

    const onTerminalInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    }

    const onTerminalClick = () => {
        if (inputRef.current === null) return ;
        inputRef.current.focus();
    }

    const onTerminalInputKeyDown = (event:KeyboardEvent<HTMLInputElement>) => {
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
        }
    }

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
                {commandLog.map((command,index) => (<span key={index}>{command.prefix}{command.message}</span>))}
                <span className="terminalInputWrap">{getCurrentPrefix()}
                    <form className="terminalInputForm" onSubmit={onMessageSent}>
                        <input 
                            type="text" 
                            className="terminalInput"
                            value={userInput}
                            onChange={onTerminalInputChange}
                            ref={inputRef}
                            onKeyDown={(e) => onTerminalInputKeyDown(e)}
                        />
                        <button style={{ width: 0 }} hidden></button>
                    </form>
                </span>
            </div>
        </div>
    );
}

export default Terminal;