export type TerminalFunction = React.FC<{
    userInput: string,
    setUserInput: React.Dispatch<React.SetStateAction<string>>
}>