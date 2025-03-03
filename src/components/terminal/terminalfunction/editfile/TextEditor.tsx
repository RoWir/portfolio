import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { File } from "../../_types"
import { FileSystemContext } from "../../FileSystemContext";

interface TextEditorProps {
    selectedFile: File|null;
}

const TextEditor: React.FC<TextEditorProps> = ({ selectedFile }) => {
    const fileSystem = useContext(FileSystemContext);
    const selectionRef = useRef(null);
    const [fileData, setFileData] = useState<string>("");

    const handleInput = useCallback((e:FormEvent<HTMLDivElement>) => {
        setFileData(e.currentTarget.innerHTML);
    }, [setFileData]);

    useEffect(() => {
        if (selectionRef.current) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.setStart(selectionRef.current, 0);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, [fileData]);

    useEffect(() => {
        const getTestFile = () => {
            const a = atob('aW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gInJlYWN0IjsNCmltcG9ydCB7IEZpbGUgfSBmcm9tICIuLi8uLi9fdHlwZXMiDQppbXBvcnQgeyBGaWxlU3lzdGVtQ29udGV4dCB9IGZyb20gIi4uLy4uL0ZpbGVTeXN0ZW1Db250ZXh0IjsNCg0KaW50ZXJmYWNlIFRleHRFZGl0b3JQcm9wcyB7DQogICAgc2VsZWN0ZWRGaWxlOiBGaWxlfG51bGw7DQp9DQoNCmNvbnN0IFRleHRFZGl0b3I6IFJlYWN0LkZDPFRleHRFZGl0b3JQcm9wcz4gPSAoeyBzZWxlY3RlZEZpbGUgfSkgPT4gew0KICAgIGNvbnN0IGZpbGVTeXN0ZW0gPSB1c2VDb250ZXh0KEZpbGVTeXN0ZW1Db250ZXh0KTsNCiAgICBpZiAoIWZpbGVTeXN0ZW0pIHJldHVybiAiIjsNCiAgICBpZiAoc2VsZWN0ZWRGaWxlID09PSBudWxsKSByZXR1cm4gPGRpdj5LZWluZSBEYXRlaSBhdXNnZXfDpGhsdDwvZGl2Pg0KDQogICAgY29uc3QgZGF0YSA9IGZpbGVTeXN0ZW0ucmVhZEZpbGUoc2VsZWN0ZWRGaWxlKQ0KDQogICAgcmV0dXJuICgNCiAgICAgICAgPGRpdj4NCg0KICAgICAgICA8L2Rpdj4NCiAgICApOw0KfQ0KDQpleHBvcnQgZGVmYXVsdCBUZXh0RWRpdG9yOw==');
            const binaryArray = new Uint8Array(a.length);
            for (let i = 0; i < a.length; i++) {
                binaryArray[i] = a.charCodeAt(i);
            }
            return binaryArray.buffer;
        }
    
        console.log(selectedFile);
        const data = new TextDecoder('utf8').decode(getTestFile());

        setFileData(data);
    }, [selectedFile])

    if (!fileSystem) return "";
    if (selectedFile === null) return <div>Keine Datei ausgewählt</div>

    
    return (
        <div style={{ flexDirection: 'column' ,display: "flex", width: "100%", height: "100%", flexGrow: 1, padding: "0.5em" }}>
            {fileData.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} style={{ height: '1.2em', whiteSpace: 'pre' }}>
                    {line}
                </div>
            ))}
        </div>
    );
}

export default TextEditor;