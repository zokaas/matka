import React from "react";
import { T_StepContainerProps } from "./types";

export const StepBadge: React.FC<T_StepContainerProps> = ({
    children,
    defaultClasses,
    hardcodedClasses,
    overridingClasses,
}) => {
    const classes = hardcodedClasses || overridingClasses || defaultClasses;

    return <div className={classes}>{children}</div>;
};
