import { TerminalFunction } from "./_types";

const AboutMe: TerminalFunction = () => {
    return (
        <div style={{ display: "flex", flexDirection: 'column' }}>
            <span>Mein Name ist Robin Wirth</span>
            <span>Und das hier ist meine Seite</span>
            <span>Ich mag React!</span>
        </div>
    )
}

export default AboutMe;

AboutMe.description = "About me";