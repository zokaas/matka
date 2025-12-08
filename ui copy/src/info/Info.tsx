import React from "react";
import { T_InfoProps } from "./types";

export const Info: React.FC<T_InfoProps> = ({ children, className }) => {
    return <div className={className}>{children}</div>;
};
