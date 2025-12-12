import { JSX, ReactNode } from "react";

export type T_FooterProps = {
    children?: () => JSX.Element;
};

export type T_FooterContainerProps = {
    children?: ReactNode;
};

export type T_ItemContentProps = {
    [index: string]: string;
};
