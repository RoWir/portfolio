import { useContext, useEffect } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Ls:TerminalFunction = () => {
    const fileSystem = useContext(FileSystemContext);
    if (!fileSystem) return "Context Error!";

    const folderTextStyle = {
        color: 'blue'
    }

    useEffect(() => {
        const entries = fileSystem.getCurrentNode().map(nodeEntry => <span style={nodeEntry.type === 'folder' ? folderTextStyle:{}}>{nodeEntry.name}</span>);
        fileSystem.addToCommandLog(<div style={{ display: 'flex', gap: '10px' }}>{...entries}</div>, "");
    }, []);
    
    return "";
}

export default Ls;

export function description() {
    return "Zeigt Inhalte des aktuellen Verzeichnises an";
}