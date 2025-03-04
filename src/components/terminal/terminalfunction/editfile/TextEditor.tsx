import { FormEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { File } from "../../_types"
import { FileSystemContext } from "../../FileSystemContext";
import './TextEditor.css';

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
            console.log(binaryArray);
            return binaryArray.buffer;
        }
    
        console.log(selectedFile);
        const data = new TextDecoder('utf8').decode(getTestFile());
        if (!selectedFile) return;
        setFileData(new TextDecoder('utf8').decode(selectedFile.file));
    }, [selectedFile])

    const onLineKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, lineIndex:number) => {
        const target = e.currentTarget;
        if (!(target instanceof HTMLInputElement) || target.selectionStart === null) return;
        const value = target.value;

        if (e.key === 'Enter') {
            e.preventDefault();
            insertLineData(lineIndex, value.slice(0, target.selectionStart)+'\n');
            insertLineData(lineIndex+1, value.slice(target.selectionStart, value.length));
            const nextLine = document.getElementsByClassName('textEditorInput')[lineIndex+1] as HTMLInputElement;
            nextLine.value = value.slice(target.selectionStart, value.length);
            nextLine.focus();
            nextLine.setSelectionRange(0, 0);
        } else if (e.key === 'Backspace' && target.selectionStart === 0 && lineIndex > 0) {
            e.preventDefault();
            const prevLine = document.getElementsByClassName('textEditorInput')[lineIndex-1] as HTMLInputElement;
            const prevLineLength = prevLine.value.length;
            insertLineData(lineIndex-1, prevLine.value + value);
            removeLineData(lineIndex);
            prevLine.value = prevLine.value + value;
            prevLine.focus();
            prevLine.setSelectionRange(prevLineLength, prevLineLength);
        } else if (e.key === 'ArrowUp' && lineIndex > 0) {
            e.preventDefault();
            const prevLine = document.getElementsByClassName('textEditorInput')[lineIndex-1] as HTMLInputElement;
            prevLine.focus();
            prevLine.setSelectionRange(target.selectionStart, target.selectionStart);
        } else if (e.key === 'ArrowDown' && lineIndex < fileData.split('\n').length-1) {
            e.preventDefault();
            const nextLine = document.getElementsByClassName('textEditorInput')[lineIndex+1] as HTMLInputElement;
            nextLine.focus();
            nextLine.setSelectionRange(target.selectionStart, target.selectionStart);
        } else if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (!selectedFile) return;
            fileSystem?.updateFile({ ...selectedFile, file: new TextEncoder().encode(fileData) });
        }
    }, [])

    const onLineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, lineIndex: number) => {
        insertLineData(lineIndex, e.target.value);
    }, [])

    const insertLineData = useCallback((lineIndex: number, data: string) => {
        setFileData(prevState => prevState.split('\n').map((line, index) => index === lineIndex ? data : line).join('\n'));
    }, []);

    const removeLineData = useCallback((lineIndex: number) => {
        setFileData(prevState => prevState.split('\n').filter((_, index) => index !== lineIndex).join('\n'));
    }, [])

    if (!fileSystem) return "";
    if (selectedFile === null) return <div>Keine Datei ausgewählt</div>
    
    return (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div className="textEditorRowNumber">
                {fileData.split('\n').map((_, lineIndex) => (
                    <span key={lineIndex}>{lineIndex+1}</span>
                ))}
            </div>
            <div style={{ height: '1.2em', whiteSpace: 'pre', display: 'flex', flexDirection: 'column', paddingLeft: '5px' }}>
                {fileData.split('\n').map((line, lineIndex) => (
                    <input className="textEditorInput" type="text" onKeyDown={e => onLineKeyDown(e, lineIndex)} onChange={e => onLineChange(e, lineIndex)} key={lineIndex} value={line}></input>
                ))}
            </div>
        </div>
    );
}

export default TextEditor;