import { FunctionParam, TerminalFunction } from "./_types";

type ModuleInfo = Record<string, { 
    default: TerminalFunction
}>;
type CommandInfo = { name: string, description: string, category: string, functionParams: FunctionParam[] };

const headingStyle:React.CSSProperties={
    fontWeight: 'bold',
    margin: '0 auto',
    textTransform: 'capitalize'
};
const commandRowStyle:React.CSSProperties={
    marginLeft: '10px'
};
const commandStyle:React.CSSProperties={
    width: '30%',
    display: 'inline-flex'
};
const commandDescriptionStyle:React.CSSProperties={
    width: '70%',
    display: 'inline-flex'
};

const Help:TerminalFunction = ({userInput}) => {
    const command = userInput.split(" ")[1];

    if (!command) return getHelpOverview();

    return getCommandOverview(command);
}

const getCommandInfos = (command?: string):CommandInfo[] => {
    const commandImports: ModuleInfo = import.meta.glob("/src/components/terminal/terminalfunction/*.tsx", { eager: true });
    return Object.entries(commandImports)
        .filter((path) => !path[0].includes('_types.tsx'))
        .map(([path, mod]) => {
            const fileName = path.split('/').pop() ?? path;
            const CommandComponent = mod.default;
            return {
                name: fileName?.replace(/\.[^/.]+$/, ''),
                description: CommandComponent.description ?? '',
                category: CommandComponent.category ?? 'general',
                functionParams: CommandComponent.functionParams ?? []
            };
        })
        .filter(commandEntry => !command || commandEntry.name === command);
}

const getCommandOverview = (command: string) => {
    const commandInfoArray = getCommandInfos(command);
    if (commandInfoArray.length === 0) return "Der Befehl '" + command + "' konnte nicht gefunden werden. Tippfehler?";

    const commandInfo = commandInfoArray[0];
    if (commandInfo.functionParams.length === 0) return commandInfo.description;

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={headingStyle}>{commandInfo.name}</span>
            {commandInfo.functionParams.map((commandParam) => (
                <div key={commandParam.params.map(paramEntry => paramEntry.param).join("-")} style={commandRowStyle}>
                    <span style={commandStyle}>{commandInfo.name+' '+commandParam.params.map(paramEntry => `${paramEntry.required ? '(' : '['}${paramEntry.param}${paramEntry.required ? ')' : ']'}`).join(" ")}</span>
                    <span style={commandDescriptionStyle}>{commandParam.description}</span>
                </div>
            ))}
        </div>
    );
}

const getHelpOverview = () => {
    const commandList = getCommandInfos();

    const groupedCommands = commandList.reduce((acc, command) => {
        command.category = command.category === undefined ? 'general' : command.category;
        if (!acc[command.category]) {
          acc[command.category] = [];
        }
        acc[command.category].push(command);
        return acc;
    }, {} as Record<string, typeof commandList>);
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Object.entries(groupedCommands).map(([category, commands], index) => (
                <div key={category} style={{ display: 'flex', flexDirection: 'column' }}>
                    {index !== 0 ? <br/>: ''}
                    <span style={headingStyle}>{category}</span>
                    {commands.map(commandEntry => 
                        <div key={commandEntry.name} style={commandRowStyle}>
                            <span style={commandStyle}>{commandEntry.name}</span>
                            <span style={commandDescriptionStyle}>{commandEntry.description}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Help;
Help.autoCompleteValues = () => [
    getCommandInfos().map(command => command.name)
];