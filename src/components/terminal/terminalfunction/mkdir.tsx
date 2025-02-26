import { useContext, useEffect } from "react";
import { TerminalFunction } from "./_types";
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

