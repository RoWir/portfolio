import React, { createContext, PropsWithChildren, ReactElement, SetStateAction, useEffect, useState } from "react";
import { Command, File, Folder, TreeNode } from "./_types";

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
    createFolder: (folderName: string) => void,
    readFile: (fileName: string) => Uint8Array<ArrayBufferLike> | undefined,
    writeFile: (fileName: string, data: Uint8Array<ArrayBufferLike>) => void,
    systemTree: TreeNode,
    commandPrefix: string
}|null;

export const FileSystemContext = createContext<FileSystemContextType>(null);

export const FileSystemProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [systemTree, setSystemTree] = useState<TreeNode>([
        {type:'folder' as const,name:'testFolder',path:'',children: [{
            type:'folder' as const,
            name:'test2',
            children:[{type:'file' as const,name:'testFile',file: new Uint8Array(),id: crypto.randomUUID(),path:'testFolder/test2/'}],
            path: ''
        },{
            type:'file' as const,name:'testFile',file: new Uint8Array(),id: crypto.randomUUID(),path:'testFolder/'
        }]},
        {type:'file' as const,name:'testFile',file: new Uint8Array(),id: crypto.randomUUID(),path:''},
        {type:'file' as const,name:'anotherTestFile',file: new Uint8Array(),id: crypto.randomUUID(),path:''}
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

    useEffect(() => {
        console.log(getCurrentPrefix());
    }, [currentPath,commandPrefix])

    const getCurrentNode = () => {
        let currentNode: TreeNode = systemTree;
        currentPath.forEach(path => {
            const folder = currentNode.find(node => node.type === 'folder' && node.name === path);
            if (folder && folder.type === 'folder') currentNode = folder.children;
        });
        return currentNode;
    }

    const changeNode = (path:string) => {
        const inputArray = path.split("/").filter(Boolean);

        if (inputArray[0] === '~') {
            setCurrentPath([]);
            return true;
        }

        if (inputArray[0] === '..') {
            if (currentPath.length > 1) {
                setCurrentPath(prevState => prevState.slice(0, -1));
                return true;
            } else {
                setCurrentPath([]);
                return true;
            }
        }

        const pathArray = [...currentPath, ...inputArray];

        let currentNode = systemTree;
        
        for (const path of pathArray) {
            const folder = currentNode.find(node => node.type === 'folder' && node.name === path);
            if (folder && folder.type === 'folder') {
                currentNode = folder.children;
            } else {
                return false;
            }
        };
        setCurrentPath(pathArray);
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
                file: file,
                id: crypto.randomUUID(),
                path: currentPath.length === 0 ? '' : currentPath.join('/') + '/'
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
                children: [],
                path: currentPath.length === 0 ? '' : currentPath.join('/') + '/'
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

    const readFile = (fileName:string) => {
        const currentNode = getCurrentNode();
        const file = currentNode.find(node => "file" in node && node.name === fileName);
        if (file) {
            return (file as File).file;
        } else return file;
    }

    const writeFile = (fileName:string, data:Uint8Array<ArrayBufferLike>) => {
        const currentNode = getCurrentNode();
        const file = currentNode.find(node => "file" in node && node.name === fileName);
        if (file) {
            (file as File).file = data;
        } else addToCommandLog("Die Datei wurde nicht gefunden","");
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
            createFolder,
            readFile,
            writeFile,
            systemTree,
            commandPrefix
        }}>
            {children}
        </FileSystemContext.Provider>
    );
};
