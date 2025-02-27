import { useContext, useEffect } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Mkfile:TerminalFunction = ({userInput}) => {
    const fileSystem = useContext(FileSystemContext);
    const inputSplit = userInput.split(" ");
    const fileName = inputSplit[1];
    let fileContent = userInput.split(" ")[2];

    if (inputSplit.length > 2) {
        fileContent = inputSplit.slice(2).join(" ");
    }

    useEffect(() => {
        if (fileName) {
            fileSystem?.createFile(fileName, fileContent ?? "Du hast diese Datei erstellt!");
        } else {
            fileSystem?.addToCommandLog("Bitte einen Dateinamen angeben", "");
        }
    }, []);
        
    return "";
}

export default Mkfile;

Mkfile.description = "Erstellt eine Datei";

Mkfile.category = 'filesystem';

Mkfile.functionParams = [{ 
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