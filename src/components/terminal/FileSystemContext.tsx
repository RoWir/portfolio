import React, { createContext, PropsWithChildren, ReactElement, SetStateAction, useEffect, useState } from "react";
import { Command } from "./_types";

// Create a context to provide `setCommandPrefix`
export type FileSystemContextType = {
    changeNode: (path: string) => boolean,
    currentPath: string[],
    createFile: (fileName: string, fileContent: string) => void,
    getCurrentNode: () => TreeNode,
    commandLog: Command[],
    addToCommandLog: (message:string|ReactElement, prefix:string) => void,
    getCurrentPrefix: () => string,
    setCommandPrefix: React.Dispatch<SetStateAction<string>>,
    clearCommandLog: () => void,
    createFolder: (folderName: string) => void
}|null;

export const FileSystemContext = createContext<FileSystemContextType>(null);

type File = {
    type: 'file',
    name: string,
    file: Uint8Array<ArrayBufferLike>
}

type Folder = {
    type: 'folder',
    name: string,
    children: TreeNode
}

type TreeNode = (File|Folder)[]

export const FileSystemProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [systemTree, setSystemTree] = useState<TreeNode>([
        {type:'folder' as const,name:'testFolder',children:[{type:'folder' as const,name:'test2',children:[]}]},
        {type:'file' as const,name:'testFile',file: new Uint8Array()},
        {type:'file' as const,name:'anotherTestFile',file: new Uint8Array()}
    ]);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [commandLog, setCommandLog] = useState<Command[]>([
        { message: "Type 'help' to show all the available commands", prefix: '' }
    ]);
    const [commandPrefix, setCommandPrefix] = useState("user@des: ");

    const clearCommandLog = () => {
        setCommandLog([{ message: "Type 'help' to show all the available commands", prefix: '' }]);
    }

    const addToCommandLog = (message:string|ReactElement, prefix:string) => {
        setCommandLog(prevState => ([ ...prevState, { message: message, prefix: prefix }]));
    }

    const getCurrentPrefix = () => commandPrefix + (currentPath.length !== 0 ? currentPath.join('/') : '~') + ' %\xa0';

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

    const createFile = (fileName:string, fileContent: string) => {
        const currentNode = getCurrentNode();

        const fileNameTaken = currentNode.find(node => node.name.trim() === fileName.trim());

        if (!fileNameTaken) {
            const file = new TextEncoder().encode(fileContent);

            const newFile: File = {
                type: 'file',
                name: fileName,
                file: file
            }

            setSystemTree(prevState => addNodeToTree(prevState, newFile, currentPath));
            return addToCommandLog("Datei '" + fileName + "' wurde erstellt", "");
        } else return addToCommandLog("Es gibt bereits eine Datei mit dem Namen '" + fileName + "' in diesem Verzeichnis", "");
    }

    const createFolder = (folderName:string) => {
        const currentNode = getCurrentNode();

        const folderNameTaken = currentNode.find(node => node.name.trim() === folderName.trim());

        if (!folderNameTaken) {
            const newFolder: Folder = {
                type: 'folder',
                name: folderName,
                children: []
            }

            setSystemTree(prevState => addNodeToTree(prevState, newFolder, currentPath));
            return addToCommandLog("Verzeichnis '" + folderName + "' wurde erstellt", "");
        } else return addToCommandLog("Es gibt bereits ein Verzeichnis mit dem Namen '" + folderName + "' in diesem Verzeichnis", "");
    }

    const addNodeToTree = (tree:TreeNode, newNode: File|Folder, path: string[]):TreeNode => {
        if (path.length === 0) return [...tree, newNode];

        return tree.map(node => {
            if (node.type === 'folder' && node.name === path[0]) {
                if (path.length === 1) {
                    return { ...node, children: [...node.children, newNode ]};
                } else {
                    return { ...node, children: addNodeToTree(node.children, newNode, path.slice(1)) }
                }
            } return node;
        })
    }

    useEffect(() => {
        console.log(systemTree)
    }, [systemTree])

    return (
        <FileSystemContext.Provider value={{ 
            changeNode,
            currentPath,
            createFile,
            getCurrentNode,
            commandLog,
            addToCommandLog,
            getCurrentPrefix,
            setCommandPrefix,
            clearCommandLog,
            createFolder 
        }}>
            {children}
        </FileSystemContext.Provider>
    );
};
