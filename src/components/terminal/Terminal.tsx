import { ChangeEvent, FC, FormEvent, useState } from "react";
import "./Terminal.css"
import { FaCircle } from "react-icons/fa";

// interface TerminalProps {
    
// }

const Terminal: FC = () => {
    const [commandLog, setCommandLog] = useState([
        { message: "Type 'help' to show all the available commands", prefix: false },
        { message: "hallo", prefix: true }
    ]);

    const [commandPrefix, setCommandPrefix] = useState("user@des: ~ % ");

    const [userInput, setUserInput] = useState("");

    const onMessageSent = (e:FormEvent) => {
        e.preventDefault();
        console.log(userInput);
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
                {commandLog.map(command => (<span key={command.message}>{command.prefix ? commandPrefix:''}{command.message}</span>))}
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