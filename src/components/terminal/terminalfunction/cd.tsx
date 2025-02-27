import { useContext, useEffect, useState } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext, FileSystemContextType } from "../FileSystemContext";

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

export const category = 'filesystem';

export const autoCompleteValues = (fileSystem: FileSystemContextType) => [
    fileSystem!.getCurrentNode()
        .filter(node => node.type === 'folder')
        .map(node => node.name)
];