import { useContext, useEffect } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Mkdir:TerminalFunction = ({userInput}) => {
    const fileSystem = useContext(FileSystemContext);
    const folderName = userInput.split(" ")[1];

    useEffect(() => {
        if (!fileSystem) return;
        if (!folderName) return fileSystem.addToCommandLog("Bitte einen Dateinamen angeben", "");
        
        fileSystem.createFolder(folderName);
    }, []);
        
    return "";
}

export default Mkdir;

Mkdir.description = "Erstellt ein Verzeichnis";

Mkdir.category = 'filesystem';

Mkdir.functionParams = [{ 
    params: [
        { param: 'Name', required: true }
    ], 
    description: 'Erstellt ein Verzeichnis mit dem angegebenen Namen' 
}];