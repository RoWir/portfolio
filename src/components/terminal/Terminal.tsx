import { ChangeEvent, FC, FormEvent, ReactElement, useState } from "react";
import "./Terminal.css"
import { FaCircle } from "react-icons/fa";

// interface TerminalProps {
    
// }

type Command = {
    message: string | ReactElement,
    prefix: boolean
}

const Terminal: FC = () => {
    const [commandLog, setCommandLog] = useState<Command[]>([
        { message: "Type 'help' to show all the available commands", prefix: false }
    ]);

    const [commandPrefix, setCommandPrefix] = useState("user@des: ~ % ");

    const [userInput, setUserInput] = useState("");

    const addToCommandLog = (message:string|ReactElement, prefix:boolean) => {
        setCommandLog(prevState => ([ ...prevState, { message: message, prefix: prefix }]));
    }

    const onMessageSent = (e:FormEvent) => {
        e.preventDefault();
        addToCommandLog(userInput, true);
        
        const commandImports: Record<string, { default: Function }> = import.meta.glob("/src/components/terminal/terminalfunction/*.tsx", { eager: true });
        const commandList:{ func: Function, name: string|undefined }[] = Object.entries(commandImports)
            .filter((path) => !path[0].includes('_types.tsx'))
            .map(([path, mod]) => {
            const fileName = path.split('/').pop();
            return {
                func: mod.default,
                name: fileName?.replace(/\.[^/.]+$/, '')
            };
        });

        commandList.forEach(command => {
            if (command.name === userInput) {
                addToCommandLog(command.func(userInput, commandPrefix, setUserInput, setCommandPrefix, setCommandLog), false);
            }
        });

        setUserInput("");
    }

    const onTerminalInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
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
            <div className="terminalBody">
                {commandLog.map((command,index) => (<span key={index}>{command.prefix ? commandPrefix:''}{command.message}</span>))}
                <span className="terminalInputWrap">{commandPrefix}
                    <form className="terminalInputForm" onSubmit={onMessageSent}>
                        <input 
                            type="text" 
                            className="terminalInput"
                            value={userInput}
                            onChange={onTerminalInputChange}
                        />
                        <button style={{ width: 0 }} hidden></button>
                    </form>
                </span>
            </div>
        </div>
    );
}

export default Terminal;