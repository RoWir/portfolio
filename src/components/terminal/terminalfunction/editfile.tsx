import { useContext, useState, useCallback } from "react";
import { FileSystemContext, FileSystemContextType } from "../FileSystemContext";
import { TerminalFunction } from "./_types";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import './editfile.css'
import FileBrowser from "./editfile/FileBrowser";
import { File } from "../_types";

const EditFile: TerminalFunction = ({ setFullscreenApp }) => {
    const [selectedFile, setSelectedFile] = useState<File|null>(null);
    const fileSystem = useContext(FileSystemContext);

    if (!fileSystem) return "";

    const onCloseEditor = useCallback(() => {
        setFullscreenApp(null);
    },[setFullscreenApp])
    
    return (
        <div className="editFileWrap">
            <div className="editFileHeader">
                <span className="editFileVersion">Editor v1</span>
                <span className="editFileLocation">{fileSystem.commandPrefix + (selectedFile === null ? '~' :  selectedFile.path === '' ? '~' : selectedFile.path) + '\xa0' + (selectedFile === null ? '' :  selectedFile.name)}</span>
                <div className="editFileHeaderBtns">
                    <button><HiMagnifyingGlass /></button>
                    <button onClick={onCloseEditor}><MdClose /></button>
                </div>
            </div>
            <div className="editorBody">
                <div className="editorFileBrowser">
                    <FileBrowser selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
                </div>
                <div className="editorTextArea">

                </div>
            </div>
        </div>
    );

  // Load file content initially
  /*useEffect(() => {
    if (!fileSystem) {
      setError("File system not available");
      return;
    }

    const args = userInput.split(" ");
    if (args.length < 2 || !args[1]) {
      setError("Usage: edit [filename]");
      return;
    }

    const fname = args[1];
    setFilename(fname);
    
    try {

        const fileData = fileSystem.readFile(fname);
        
        if (fileData) {
            const decoder = new TextDecoder("utf-8");
            const textContent = decoder.decode(fileData);
            setFileContent(textContent);
        } else {
            setFileContent("");
        }
      
        setIsEditing(true);
        setError(null);
    } catch (err) {
        setError(`Error opening file: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [userInput, fileSystem]);

  // Save file handler
  const handleSave = useCallback(() => {
    if (!fileSystem || !filename) return;
    
    try {
      // Convert string to Uint8Array for saving
      const encoder = new TextEncoder();
      const data = encoder.encode(fileContent);
      
      fileSystem.writeFile(filename, data);
      setEditMessage(`File saved: ${filename}`);
    } catch (err) {
      setError(`Error saving file: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [fileContent, filename, fileSystem]);

  // Cancel editing handler
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditMessage("Edit canceled");
    // Clear the terminal input if setUserInput is provided
    if (setUserInput) {
      setUserInput("");
    }
  }, [setUserInput]);

  // Handle key commands
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    // Esc to cancel
    else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (error) {
    return error;
  }

  if (!isEditing) {
    return editMessage;
  }

  // Render editor
  return (
    <div className="file-editor">
      <div className="editor-header">
        <span>Editing: {filename}</span>
        <div className="editor-controls">
          <button onClick={handleSave} className="save-btn">Save (Ctrl+S)</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel (Esc)</button>
        </div>
      </div>
      <textarea
        className="editor-textarea"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        spellCheck={false}
      />
      {editMessage && <div className="editor-message">{editMessage}</div>}
    </div>
  );*/
};

// Add metadata to the component
EditFile.description = "Edit file contents (edit [filename])";
EditFile.category = 'filesystem';
EditFile.autoCompleteValues = (fileSystem: FileSystemContextType) => {
    if (!fileSystem) return [[]];
    const files = fileSystem.getCurrentNode().filter(node => node.type === 'file').map(node => node.name);
      
    return [files];
};
EditFile.fullscreen = true;

export default EditFile;