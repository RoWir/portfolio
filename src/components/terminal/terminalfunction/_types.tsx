export type TerminalFunction = React.FC<{
    userInput: string,
    setUserInput: React.Dispatch<React.SetStateAction<string>>,
    setAutocompleteSuggestions: React.Dispatch<React.SetStateAction<string[]>>
}>

export type FunctionParam = {
    params: {
        param: string;
        required: boolean;
    }[];
    description: string;
}