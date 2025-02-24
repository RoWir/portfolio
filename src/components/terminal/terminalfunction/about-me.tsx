export default () => {
    return (
        <div style={{ display: "flex", flexDirection: 'column' }}>
            <span>Mein Name ist Robin Wirth</span>
            <span>Und das hier ist meine Seite</span>
            <span>Ich mag React!</span>
        </div>
    )
}

export function description() {
    return "Gibt einen kleinen Überblick über mich";
}