import { PropsWithChildren } from "react";

export type TNote = {
    id?: string
    type: 1 | 2
    title?: string
    description: string
    createdAt: Date | null
}
export interface INoteCarsProps extends PropsWithChildren<TNote> {
    onCreated: (note: TNote | undefined) => void
    onUpdated: (note: TNote | undefined) => void
    onDeleted: (note: TNote | undefined) => void
}