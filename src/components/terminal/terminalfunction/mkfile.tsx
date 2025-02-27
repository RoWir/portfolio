import { useContext, useEffect } from "react";
import { FunctionParam, TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Mkfile:TerminalFunction = ({userInput}) => {
    const inputSplit = userInput.split(" ");
    const fileName = inputSplit[1];
    let fileContent = userInput.split(" ")[2];

    if (inputSplit.length > 2) {
        fileContent = inputSplit.slice(2).join(" ");
    }

    if (!fileName) {
        return "Bitte einen Dateinamen angeben"
    }

    const fileSystem = useContext(FileSystemContext);
    if (!fileSystem) return "Context Error!";
    console.log(fileSystem.createFile.toString())
    useEffect(() => {
        fileSystem.createFile(fileName, fileContent ?? "Du hast diese Datei erstellt!");
    }, []);
        
    return "";
}

export default Mkfile;

export function description() {
    return "Erstellt eine Datei";
}

export const category = 'filesystem';

export const functionParams: FunctionParam[] = [{ 
    params: [{ 
        param: 'Name', 
        required: true 
    }], 
    description: 'Erstellt eine Datei mit dem angegebenen Namen'
}, {
    params: [{ 
        param: 'Name', 
        required: true 
    }, { 
        param: 'Inhalt', 
        required: false
    }], 
    description: 'Erstellt eine Datei mit dem angegebenen Namen und fügt den angegebenen Text hinzu'
}];