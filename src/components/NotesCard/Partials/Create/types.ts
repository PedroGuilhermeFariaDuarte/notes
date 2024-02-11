import { PropsWithChildren } from "react";

// Types
import { INoteCarsProps } from "../../types";

export interface ICreateProps extends Partial<PropsWithChildren<Omit<INoteCarsProps, 'type'>>> {
    type: 1 | 2
}