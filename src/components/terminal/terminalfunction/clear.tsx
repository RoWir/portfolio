import { TerminalFunction } from "./_types";

const Clear: TerminalFunction = ({ setCommandLog }) => {
    setCommandLog([
        { message: "Type 'help' to show all the available commands", prefix: '' }
    ]);
    return ("Cleared!");
}

export default Clear;

export function description() {
    return "Leert das Terminal";
}