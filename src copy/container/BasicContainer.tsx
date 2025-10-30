import React from "react";
import { T_BasicContainerProps } from "./types";

// TODO: Currently not in use, as I am not sure if it is needed. But code is already written, so I'll let it be here
export const BasicContainer: React.FC<T_BasicContainerProps> = ({ className, children }) => {
    if (className) return <div className={className}>{children}</div>;

    return <div>{children}</div>;
};
