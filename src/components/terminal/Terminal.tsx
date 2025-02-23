import { FC, useState } from "react";
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
                <span className="terminalInputWrap">{commandPrefix}<input type="text" className="terminalInput"></input></span>
            </div>
        </div>
    );
}

export default Terminal;