import { PropsWithChildren } from "react";

// Types
import { INoteCarsProps } from "../../types";

export interface ICreatedProps extends PropsWithChildren<Omit<INoteCarsProps, 'type'>> {
    type?: 1 | 2
}