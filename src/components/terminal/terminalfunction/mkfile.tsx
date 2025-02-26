import { useContext, useEffect } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Mkfile:TerminalFunction = ({userInput}) => {
    const fileName = userInput.split(" ")[1];

    if (!fileName) {
        return "Bitte einen Dateinamen angeben"
    }

    const fileSystem = useContext(FileSystemContext);
    if (!fileSystem) return "Context Error!";

    useEffect(() => {
        fileSystem.createFile(fileName, "Du hast diese Datei erstellt!");
    }, []);
        
    return "";
}

export default Mkfile;

