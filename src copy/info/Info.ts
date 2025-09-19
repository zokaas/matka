import React from "react";
import { T_InfoProps } from "./types";
import { Tooltip } from "@ui/tooltip";
import { Subheader } from "@ui/subheader";

export const Info: React.FC<T_InfoProps> = ({
    componentType,
    infoHeader,
    infoDescription,
    classNames,
    side = "top",
    sideOffset = 5,
}) => {
    if (componentType === "tooltip") {
        return (
            <Tooltip
                header={infoHeader}
                description={infoDescription}
                classNames={classNames?.tooltip}
                side={side}
                sideOffset={sideOffset}
            />
        );
    }

    if (componentType === "subheader") {
        return (
            <Subheader
                header={infoHeader}
                description={infoDescription}
                classNames={classNames?.subheader}
            />
        );
    }

    return null;
};