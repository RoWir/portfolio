import { useContext, useEffect } from "react";
import { FunctionParam, TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Mkdir:TerminalFunction = ({userInput}) => {
    const folderName = userInput.split(" ")[1];

    if (!folderName) {
        return "Bitte einen Dateinamen angeben"
    }

    const fileSystem = useContext(FileSystemContext);
    if (!fileSystem) return "Context Error!";

    useEffect(() => {
        fileSystem.createFolder(folderName);
    }, []);
        
    return "";
}

export default Mkdir;

export function description() {
    return "Erstellt ein Verzeichnis";
}

export const category = 'filesystem';

export const functionParams: FunctionParam[] = [{ 
    params: [
        { param: 'Name', required: true }
    ], 
    description: 'Erstellt ein Verzeichnis mit dem angegebenen Namen' 
}];