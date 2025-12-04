import React from "react";
import { T_StepLabelProps } from "./types";

export const StepLabel: React.FC<T_StepLabelProps> = ({
    label,
    defaultClasses,
    hardcodedClasses,
    overridingClasses,
}) => {
    const classes = hardcodedClasses || overridingClasses || defaultClasses;

    return <span className={classes}>{label}</span>;
};
