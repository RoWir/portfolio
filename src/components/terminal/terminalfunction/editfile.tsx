import { useContext, useState, useCallback, useEffect, ReactElement, FormEvent, useRef } from "react";
import { FileSystemContext, FileSystemContextType } from "../FileSystemContext";
import { TerminalFunction } from "./_types";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { FaCheck, FaSave } from "react-icons/fa";
import FileBrowser from "./editfile/FileBrowser";
import { File } from "../_types";
import TextEditor from "./editfile/TextEditor";
import SearchBar from "../SearchBar";
import './editfile.css'

const EditFile: TerminalFunction = ({ setFullscreenApp }) => {
	const [selectedFile, setSelectedFile] = useState<File|null>(null);
	const [fileData, setFileData] = useState<string>("");
	const [showToast, setShowToast] = useState(false);
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [toastContent, setToastContent] = useState<string|ReactElement>('File saved Successfully!');
	const [searchRegEx, setSearchRegEx] = useState<RegExp|null>(null);
	const fileSystem = useContext(FileSystemContext);

	useEffect(() => {
		if (showSearchBar) {
			(document.getElementsByClassName('searchBarInput')[0] as HTMLInputElement).focus();
		}
	}, [showSearchBar])

	useEffect(() => {
		if (showToast) {
			const ref = setTimeout(() => {
				setShowToast(false);
				clearTimeout(ref);
			}, 3000);
		}
	}, [showToast]);

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
    
        const data = new TextDecoder('utf8').decode(getTestFile());
        if (!selectedFile) return;
        setFileData(new TextDecoder('utf8').decode(selectedFile.file));
    }, [selectedFile])

	const onCloseEditor = useCallback(() => {
		setFullscreenApp(null);
	}, [setFullscreenApp]);

	const saveFile = useCallback(() => {
		if (!selectedFile) return;
		fileSystem?.updateFile({ ...selectedFile, file: new TextEncoder().encode(fileData) });
		setToastContent && setToastContent(
			<span style={{display: "flex", gap: "9px", alignItems: "center", fontSize: "13px" }}>
				<FaCheck />File saved Successfully!
			</span>
		);
		setShowToast && setShowToast(true);
	}, [fileSystem, selectedFile, fileData]);

	const toggleSearchBar = useCallback(() => {
		setShowSearchBar(prevState => !prevState);
	},[]);

	if (!fileSystem) return "";
  
	return (
		<div className="editFileWrap">
			<div className="editFileHeader">
				<span className="editFileVersion">Editor v1</span>
				<span className="editFileLocation">{fileSystem.commandPrefix + (selectedFile === null ? '~' :  selectedFile.path === '' ? '~' : selectedFile.path) + '\xa0' + (selectedFile === null ? '' :  selectedFile.name)}</span>
				<div className="editFileHeaderBtns">
					<button onClick={toggleSearchBar} className={`${showSearchBar ? 'btnActive' : ''}`}><HiMagnifyingGlass /></button>
					<button onClick={saveFile}><FaSave /></button>
					<button onClick={onCloseEditor}><MdClose /></button>
				</div>
			</div>
			<div className="editorBody">
				<div className="editorFileBrowser">
					<FileBrowser selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
				</div>
				<div className="editorTextArea">
					<TextEditor 
						selectedFile={selectedFile} 
						fileData={fileData} 
						setFileData={setFileData} 
						saveFile={saveFile} 
						searchRegEx={searchRegEx} 
						toggleSearchBar={toggleSearchBar}
					/>
					{showSearchBar && <SearchBar searchRegEx={searchRegEx} setSearchRegEx={setSearchRegEx} setShowSearchBar={setShowSearchBar}/>}
				</div>
			</div>
			<div className={`editFileToast ${showToast ? 'editToastActive':''}`}>{toastContent}</div>
		</div>
  	);
};

EditFile.description = "Texteditor";
EditFile.category = 'filesystem';
EditFile.autoCompleteValues = (fileSystem: FileSystemContextType) => {
	if (!fileSystem) return [[]];
	const files = fileSystem.getCurrentNode().filter(node => node.type === 'file').map(node => node.name);

	return [files];
};
EditFile.fullscreen = true;

export default EditFile;