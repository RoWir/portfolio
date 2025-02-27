import { useContext, useEffect } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Clear: TerminalFunction = () => {
    const fileSystem = useContext(FileSystemContext);
    
    useEffect(() => {
        if (!fileSystem) return console.log("Context Error!");
        fileSystem.clearCommandLog();
        fileSystem.addToCommandLog("Cleared!","");
    }, []);
        
    return ("");
}

export default Clear;

Clear.description = "Leert das Terminal";