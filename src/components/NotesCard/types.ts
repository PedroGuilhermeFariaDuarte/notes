import { PropsWithChildren } from "react";

export interface INoteCarsProps extends PropsWithChildren<unknown> {
    type: 1 | 2
    title: string
    description: string
    createdAt: Date | null
}