import { useContext, useEffect } from "react";
import { FunctionParam, TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Ls:TerminalFunction = () => {
    const fileSystem = useContext(FileSystemContext);
    if (!fileSystem) return "Context Error!";

    const folderTextStyle = {
        color: '#91bbff'
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

export const category: string = 'filesystem';

export const functionParams: FunctionParam[] = [{ params: [{ param: 'Verzeichnis', required: true }], description: 'Wechselt in das angegebene Verzeichnis' }];