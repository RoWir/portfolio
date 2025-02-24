import React, { createContext, PropsWithChildren, ReactElement, useState } from "react";

// Create a context to provide `setCommandPrefix`
export type TerminalContextType = {
    userInput: string,
    commandPrefix: string,
    commandLog: Command[],
    setCommandLog: React.Dispatch<React.SetStateAction<Command[]>>,
    setUserInput: React.Dispatch<React.SetStateAction<string>>,
    setCommandPrefix: React.Dispatch<React.SetStateAction<string>>
} | null;

export const TerminalContext = createContext<TerminalContextType>(null);

type Command = {
    message: string | ReactElement,
    prefix: boolean
}

export const CommandPrefixProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [commandLog, setCommandLog] = useState<Command[]>([
        { message: "Type 'help' to show all the available commands", prefix: false },
        { message: "hallo", prefix: true }
    ]);
    const [commandPrefix, setCommandPrefix] = useState<string>("user@des: ~ % ");
    const [userInput, setUserInput] = useState<string>("");

    return (
    <TerminalContext.Provider value={{ userInput, commandPrefix, commandLog, setUserInput, setCommandPrefix, setCommandLog }}>
        {children}
    </TerminalContext.Provider>
    );
};
