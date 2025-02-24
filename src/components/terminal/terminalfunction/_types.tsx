import { ReactElement } from "react";

type Command = {
    message: string | ReactElement,
    prefix: boolean
}

export type TerminalFunction = (
    userInput: string,
    commandPrefix: string,
    setUserInput: React.Dispatch<React.SetStateAction<string>>,
    setCommandPrefix: React.Dispatch<React.SetStateAction<string>>,
    setCommandLog: React.Dispatch<React.SetStateAction<Command[]>>
) => string|ReactElement