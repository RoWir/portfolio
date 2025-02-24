import { ReactElement } from "react";
import { Command } from "../_types";

export type TerminalFunction = (
    userInput: string,
    commandPrefix: string,
    setUserInput: React.Dispatch<React.SetStateAction<string>>,
    setCommandPrefix: React.Dispatch<React.SetStateAction<string>>,
    setCommandLog: React.Dispatch<React.SetStateAction<Command[]>>
) => string|ReactElement