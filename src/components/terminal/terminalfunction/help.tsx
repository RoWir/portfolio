import { TerminalFunction } from "./_types";

const Help:TerminalFunction = () => {
    const headingStyle={
        fontWeight: 'bold',
        margin: '0 auto'
    };
    const commandRow={
        marginLeft: '10px'
    };
    const command={
        width: '25%',
        display: 'inline-flex'
    };
    const commandDescription={
        width: '75%',
        display: 'inline-flex'
    };

    const commandImports: Record<string, { description: () => string|undefined }> = import.meta.glob("/src/components/terminal/terminalfunction/*.tsx", { eager: true });
    const commandList:{ name: string|undefined, description: string|undefined }[] = Object.entries(commandImports)
        .filter((path) => !path[0].includes('_types.tsx'))
        .map(([path, mod]) => {
            const fileName = path.split('/').pop();
            return {
                name: fileName?.replace(/\.[^/.]+$/, ''),
                description: mod.description !== undefined ? mod.description() : ''
            };
        }
    );

    console.log(commandImports)
    console.log(commandList)
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={headingStyle}>General</span>
            {commandList.map(commandEntry => <div key={commandEntry.name} style={commandRow}><span style={command}>{commandEntry.name}</span><span style={commandDescription}>{commandEntry.description}</span></div>)}
        </div>
    );
}

export default Help;