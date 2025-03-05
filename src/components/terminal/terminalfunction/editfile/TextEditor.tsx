import { useCallback, useContext, useEffect, useState } from "react";
import { File } from "../../_types"
import { FileSystemContext } from "../../FileSystemContext";
import './TextEditor.css';

interface TextEditorProps {
    selectedFile: File|null;
    fileData: string;
    setFileData: React.Dispatch<React.SetStateAction<string>>;
    saveFile: () => void;
    searchRegEx: RegExp|null;
    toggleSearchBar: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ selectedFile, fileData, setFileData, saveFile, searchRegEx, toggleSearchBar }) => {
    const fileSystem = useContext(FileSystemContext);
    
    const [newSelection, setNewSelection] = useState<{ lineIndex:number, selectionRange: { start:number, end:number }}|null>(null);

    useEffect(() => {
        if (newSelection === null) return;
        const newLine = document.getElementsByClassName('textEditorInput')[newSelection.lineIndex] as HTMLInputElement;
        newLine.focus({ preventScroll: false });
        newLine.setSelectionRange(newSelection.selectionRange.start, newSelection.selectionRange.end);
    }, [newSelection]);

    useEffect(() => {
        if (!selectedFile) return;
        setNewSelection({ lineIndex: 0, selectionRange: { start: 0, end: 0 }});
    }, [selectedFile])

    const onLineKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, lineIndex:number) => {
        const target = e.currentTarget;
        if (!(target instanceof HTMLInputElement) || target.selectionStart === null) return;
        const value = target.value;
        
        if (e.key === 'Enter') {
            e.preventDefault();
            insertLineData(lineIndex, value.slice(0, target.selectionStart)+'\n');
            insertLineData(lineIndex+1, value.slice(target.selectionStart, value.length));
            setNewSelection({ lineIndex: lineIndex+1, selectionRange: { start: 0, end: 0 }});
        } else if (e.key === 'Backspace' && target.selectionStart === 0 && lineIndex > 0) {
            e.preventDefault();
            const prevLine = document.getElementsByClassName('textEditorInput')[lineIndex-1] as HTMLInputElement;
            const prevLineLength = prevLine.value.length;
            insertLineData(lineIndex-1, prevLine.value + value);
            removeLineData(lineIndex);
            setNewSelection({ lineIndex: lineIndex-1, selectionRange: { start: prevLineLength, end: prevLineLength }});
        } else if (e.key === 'ArrowUp' && lineIndex > 0) {
            e.preventDefault();
            setNewSelection({ lineIndex: lineIndex-1, selectionRange: { start: target.selectionStart, end: target.selectionStart }});
        } else if (e.key === 'ArrowDown' && lineIndex < fileData.split('\n').length-1) {
            e.preventDefault();
            setNewSelection({ lineIndex: lineIndex+1, selectionRange: { start: target.selectionStart, end: target.selectionStart }});
        } else if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        } else if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            toggleSearchBar();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            insertLineData(lineIndex, value.slice(0, target.selectionStart)+'   '+value.slice(target.selectionStart, value.length));
            setNewSelection({ lineIndex: lineIndex, selectionRange: { start: target.selectionStart+3, end: target.selectionStart+3 }});
        }
    }, [fileData])

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
        <div style={{ display: "flex", width: "100%", flexGrow: 1 }}>
            <div className="textEditorRowNumber">
                {fileData.split('\n').map((_, lineIndex) => (
                    <span key={lineIndex}>{lineIndex+1}</span>
                ))}
            </div>
            <div style={{ height: '1.2em', whiteSpace: 'pre', display: 'flex', flexDirection: 'column', paddingLeft: '5px', flexGrow: 1 }}>
                {fileData.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex} className="textEditorHighlightWrap">
                        {searchRegEx !== null ? 
                            <div className="textEditorHighlightText">{line.split(searchRegEx).map((part, index) => (part !== "" && part.match(searchRegEx) ? <mark key={index}>{part}</mark> : part))}</div>
                        :''}
                        <input className="textEditorInput" spellCheck={false} type="text" onKeyDown={e => onLineKeyDown(e, lineIndex)} onChange={e => onLineChange(e, lineIndex)} value={line}></input>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TextEditor;