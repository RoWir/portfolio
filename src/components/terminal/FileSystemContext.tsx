import React, { createContext, PropsWithChildren, useState } from "react";

// Create a context to provide `setCommandPrefix`
export type FileSystemContextType = {
    changeNode: (path: string) => boolean,
    currentPath: string[],
    createFile: (fileName: string) => boolean
}|null;

export const FileSystemContext = createContext<FileSystemContextType>(null);

type File = {
    type: 'file',
    name: string,
    file: ArrayBuffer
}

type Folder = {
    type: 'folder',
    name: string,
    children: TreeNode
}

type TreeNode = (File|Folder)[]

export const CommandPrefixProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [systemTree, setSystemTree] = useState<TreeNode>([{type:'folder' as const,name:'test',children:[{type:'folder' as const,name:'test2',children:[]}]}]);
    const [currentPath, setCurrentPath] = useState<string[]>([]);

    const getCurrentNode = () => {
        let currentNode: TreeNode = systemTree;
        currentPath.forEach(path => {
            const folder = systemTree.find(node => node.type === 'folder' && node.name === path);
            if (folder && folder.type === 'folder') currentNode = folder.children;
        });
        return currentNode;
    }

    const changeNode = (path:string) => {
        const pathArray = path.split("/").filter(Boolean);

        if (pathArray[0] === '..') {
            if (currentPath.length > 1) {
                setCurrentPath(prevState => prevState.slice(0, -1));
                return true;
            } else {
                setCurrentPath([]);
                return true;
            }
        }
        let currentNode = getCurrentNode();
        
        for (const path of pathArray) {
            const folder = currentNode.find(node => node.type === 'folder' && node.name === path);
            if (folder && folder.type === 'folder') {
                currentNode = folder.children;
            } else {
                return false;
            }
        };
        setCurrentPath(prevState => [...prevState, ...pathArray]);
        return true;
    }

    const createFile = (fileName:string) => {
        const currentNode = getCurrentNode();

        const fileNameTaken = currentNode.find(node => node.name.trim() === fileName.trim());

        if (fileNameTaken) {
            return false;
        } else {
            
            return true;
        }
    }

    return (
    <FileSystemContext.Provider value={{ changeNode, currentPath, createFile }}>
        {children}
    </FileSystemContext.Provider>
    );
};
