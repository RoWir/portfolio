import { TerminalFunction } from "./_types";

const clear: TerminalFunction = (_userInput, _commandPrefix, _setUserInput, _setCommandPrefix, setCommandLog) => {
    setCommandLog([
        { message: "Type 'help' to show all the available commands", prefix: false }
    ]);
    return ("Cleared!");
}

export default clear;

export function description() {
    return "Leert das Terminal";
}