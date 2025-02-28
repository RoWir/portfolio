import { SetStateAction, useContext, useMemo } from "react";
import { FileSystemContext } from "../../FileSystemContext";
import { File } from "../../_types";
import TreeNode from "./TreeNode";

interface FileBrowserProps {
    selectedFile: File|null;
    setSelectedFile: React.Dispatch<SetStateAction<File|null>>;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ selectedFile, setSelectedFile }) => {
    const fileSystem = useContext(FileSystemContext);
    const cssPrefix = "editorFileBrowser";
    if (!fileSystem) return "";
    
    const tree = useMemo(() => {
        return fileSystem.systemTree
    }, [fileSystem.systemTree])

    return(
        <div className={cssPrefix + "Wrap"}>
            {tree.map((node,index) => (
                <TreeNode key={index} node={node} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            ))}
        </div>
    );
}

export default FileBrowser;