import { FileSystemContextType } from "../FileSystemContext";

export type TerminalFunction = React.FC<{
    userInput: string,
    setUserInput: React.Dispatch<React.SetStateAction<string>>,
    setAutocompleteSuggestions: React.Dispatch<React.SetStateAction<string[]>>
}> & {
    description?: string;
    category?: string;
    autoCompleteValues?(fileSystem: FileSystemContextType): string[][];
    functionParams?: FunctionParam[]
}

export type FunctionParam = {
    params: {
        param: string;
        required: boolean;
    }[];
    description: string;
}