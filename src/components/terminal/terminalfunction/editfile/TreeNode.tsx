import { useCallback, useState } from "react";
import { File, Folder } from "../../_types";
import { FaAngleDown, FaAngleRight, FaFolder, FaFile } from "react-icons/fa";
import './TreeNode.css';

interface TreeNodeProps {
    node: File | Folder;
    level?: number;
    selectedFile: File|null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File|null>>,
    path?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0, selectedFile, setSelectedFile, path = '' }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    
    const iconSize = 14;
    const isSelected = selectedFile !== null && node.type === 'file' && selectedFile.id === node.id;
    
    const toggleExpand = useCallback(() => {
        setExpanded(!expanded);
    }, [expanded]);

    const handleNodeClick = useCallback(() => {
        toggleExpand();

        if (node.type === 'file') {
            setSelectedFile(node);
        }
    }, [setSelectedFile,node,toggleExpand]);

    // const getFileIcon = useCallback((node:File|Folder) => {

    // },[])

    return (
        <>
            <div className={`treeNodeWrap ${isSelected ? 'activeNode':''}`}>
                <div onClick={handleNodeClick} style={{ paddingLeft: `${level*16}px`, fontSize: `${iconSize}px` }} className={"treeNodeBody"} >
                    {node.type === 'folder' ? (
                        <>
                            {expanded ? <FaAngleDown size={iconSize}/> : <FaAngleRight size={iconSize}/>}
                            <FaFolder style={{ marginLeft: '2px' }} size={iconSize}/>
                        </>
                    ): (
                        <span className="treeNodeFileIcon" style={{ marginLeft: iconSize+2 }}><FaFile size={iconSize}/></span>
                    )}
                    <span className="treeNodeName">{node.name}</span>
                </div>
            </div>
            {expanded && node.type === 'folder' && node.children && (
                <>
                    {node.children.map((childNode,index) => (
                        <TreeNode key={index} node={childNode} level={level+1} selectedFile={selectedFile} setSelectedFile={setSelectedFile} path={`${path + node.name}/`}/>
                    ))}
                </>
            )}
        </>
    );
}

export default TreeNode;