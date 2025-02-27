import { useContext, useEffect } from "react";
import { TerminalFunction } from "./_types";
import { FileSystemContext } from "../FileSystemContext";

const Ls:TerminalFunction = () => {
    const fileSystem = useContext(FileSystemContext);
    
    useEffect(() => {
        if (fileSystem) {
            const folderTextStyle = {
                color: '#91bbff'
            }
            const entries = fileSystem.getCurrentNode().map(nodeEntry => <span style={nodeEntry.type === 'folder' ? folderTextStyle:{}}>{nodeEntry.name}</span>);
            fileSystem.addToCommandLog(<div style={{ display: 'flex', gap: '10px' }}>{...entries}</div>, "");
        }
    }, []);
    
    return "";
}

export default Ls;

Ls.description = "Zeigt Inhalte des aktuellen Verzeichnises an";

Ls.category = 'filesystem';

Ls.functionParams = [{ params: [{ param: 'Verzeichnis', required: true }], description: 'Wechselt in das angegebene Verzeichnis' }];