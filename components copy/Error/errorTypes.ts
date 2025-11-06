import { ReactNode } from "react";

export type T_Error = {
    status: number;
    message: string;
    data?: unknown;
};

export type T_ErrorView = {
    status?: number;
    message: string;
    children?: ReactNode;
};
