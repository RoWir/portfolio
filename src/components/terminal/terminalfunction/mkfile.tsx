import { TerminalFunction } from "./_types";

const Mkfile:TerminalFunction = ({userInput}) => {
    const fileName = userInput.split(" ")[1];

    if (!fileName) {
        return "Bitte einen Dateinamen angeben"
    }

    const file = new TextEncoder().encode("This file was created by you!");

    console.log(new TextDecoder().decode(file));

    return (
        "Die Datei '" + fileName + "' wurde erstellt"
    );
}

export default Mkfile;

