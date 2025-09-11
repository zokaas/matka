import React from "react";
import { T_ContainerProps } from "./types";

export const Container: React.FC<T_ContainerProps> = ({ className, children }) => {
    if (className) return <div className={className}>{children}</div>;

    return <div>{children}</div>;
};
