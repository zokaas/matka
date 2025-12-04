import { CSSProperties } from "react";
import { T_ClassProps } from "./types";

export type T_StepContainerProps = T_ClassProps & {
    children?: React.ReactNode;
    style?: CSSProperties;
};
