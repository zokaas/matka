import React from "react";
import { T_StepContainerProps } from "./types";

export const StepContainer: React.FC<T_StepContainerProps> = ({
    children,
    defaultClasses,
    hardcodedClasses,
    overridingClasses,
    style,
}) => {
    const overridingClassesToAdd = `${overridingClasses ? overridingClasses : ""}`;
    const hardcodedlassesToAdd = `${hardcodedClasses ? hardcodedClasses : ""}`;
    const classes = `${defaultClasses} ${overridingClassesToAdd} ${hardcodedlassesToAdd}`;

    return (
        <div className={classes} style={style}>
            {children}
        </div>
    );
};
