import { ReactNode } from "react";
import { T_StatusMessagesData } from "~/services";

export type T_Error = {
    status: number;
    message: string;
    data?: unknown;
    statusMessages?: T_StatusMessagesData;
};

export type T_ErrorView = {
    status?: number;
    message: string;
    children?: ReactNode;
};
