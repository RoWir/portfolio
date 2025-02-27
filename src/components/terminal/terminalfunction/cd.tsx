import { useContext, useEffect, useState } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext, FileSystemContextType } from "../FileSystemContext";

const Cd: TerminalFunction = ({ userInput }) => {
    const [returnMessage, setReturnMessage] = useState<string>("");
    const fileSystem = useContext(FileSystemContext);

    useEffect(() => {
        if (!fileSystem) return;
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

Cd.description = "Verzeichnis ändern"

Cd.category = "filesystem";

Cd.autoCompleteValues = (fileSystem: FileSystemContextType) => [
    fileSystem!.getCurrentNode()
        .filter(node => node.type === 'folder')
        .map(node => node.name)
];