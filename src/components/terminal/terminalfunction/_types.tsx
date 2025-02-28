import { ReactElement } from "react";
import { FileSystemContextType } from "../FileSystemContext";

export type TerminalFunction = React.FC<{
    userInput: string,
    setUserInput: React.Dispatch<React.SetStateAction<string>>,
    setAutocompleteSuggestions: React.Dispatch<React.SetStateAction<string[]>>,
    setFullscreenApp: React.Dispatch<React.SetStateAction<ReactElement|null>>
}> & {
    description?: string;
    category?: string;
    autoCompleteValues?(fileSystem: FileSystemContextType): string[][];
    functionParams?: FunctionParam[],
    fullscreen?: Boolean
}

export type FunctionParam = {
    params: {
        param: string;
        required: boolean;
    }[];
    description: string;
}