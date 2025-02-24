import { ReactElement } from "react"

export type Command = {
    message: string | ReactElement,
    prefix: boolean
}