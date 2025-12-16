import React from "react";
import { T_TextProps } from "./types";

export const Text: React.FC<T_TextProps> = ({ children, className, showAs }) => {
    if (showAs && showAs === "span") return <span className={className}>{children}</span>;

    return <p className={className}>{children}</p>;
};
