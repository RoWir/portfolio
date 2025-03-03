import { SetStateAction, useContext, useMemo } from "react";
import { FileSystemContext } from "../../FileSystemContext";
import { File } from "../../_types";
import TreeNode from "./TreeNode";
import './FileBrowser.css'

interface FileBrowserProps {
    selectedFile: File|null;
    setSelectedFile: React.Dispatch<SetStateAction<File|null>>;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ selectedFile, setSelectedFile }) => {
    const fileSystem = useContext(FileSystemContext);
    const cssPrefix = "editorFileBrowser";

    const tree = useMemo(() => {
        if (!fileSystem) return [];
        return fileSystem.systemTree
    }, [fileSystem])

    
    return(
        <div className={cssPrefix + "Wrap"}>
            {tree.map((node,index) => (
                <TreeNode key={index} node={node} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            ))}
        </div>
    );
}

export default FileBrowser;