import { ReactNode } from "react";
import { SystemStyleObject } from "@styled-system/css";

export type T_ScrollProps = {
    children: ReactNode;
    to: string;
    spy?: boolean; // true
    smooth?: boolean; // true
    offset?: number; // 0
    duration?: number; // 500
    styles: SystemStyleObject;
};

export type T_ScrollContainerProps = {
    children: ReactNode;
    styles: SystemStyleObject;
};
