import { ReactElement } from "react"

export type Command = {
    message: string | ReactElement,
    prefix: string
}

export type File = {
    type: 'file',
    name: string,
    file: Uint8Array<ArrayBufferLike>,
    id: string,
    path: string
}

export type Folder = {
    type: 'folder',
    name: string,
    children: TreeNode,
    path: string
}

export type TreeNode = (File|Folder)[]