import React from "react";
import { T_StepContainerProps } from "./types";

export const StepContainer: React.FC<T_StepContainerProps> = ({
    children,
    defaultClasses,
    hardcodedClasses,
    overridingClasses,
    style,
}) => {
    const classes = hardcodedClasses || overridingClasses || defaultClasses;

    return (
        <div className={classes} style={style}>
            {children}
        </div>
    );
};
