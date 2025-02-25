import { useContext, useEffect, useState } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Cd:TerminalFunction = ({ userInput }) => {
    const [returnMessage, setReturnMessage] = useState<string>("");
    const fileSystem = useContext(FileSystemContext);
    if (!fileSystem) return "Context Error!";

    useEffect(() => {
        const path = userInput.split(" ")[1];

        if (path){
            const success = fileSystem.changeNode(path); 
        
            if (!success) {
                setReturnMessage("Ordner " + path + " nicht gefunden");
            }
        };
    }, []);
    
    return returnMessage;
}

export default Cd;

export function description() {
    return "Verzeichnis ändern"
}