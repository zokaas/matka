import React from "react";
import { T_StepLabelProps } from "./types";

export const StepLabel: React.FC<T_StepLabelProps> = ({
    label,
    defaultClasses,
    hardcodedClasses,
    overridingClasses,
}) => {
    const overridingClassesToAdd = `${overridingClasses && overridingClasses !== undefined ? overridingClasses : ""}`;
    const hardcodedlassesToAdd = `${hardcodedClasses && hardcodedClasses !== "undefined" ? hardcodedClasses : ""}`;
    const classes = `${defaultClasses} ${overridingClassesToAdd} ${hardcodedlassesToAdd}`;

    return <span className={classes}>{label}</span>;
};
