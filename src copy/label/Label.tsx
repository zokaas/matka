import React from "react";
import { T_LabelProps } from "./types";
import { Container } from "@ui/container";
import { Tooltip } from "@ui/tooltip";
import { Info } from "@ui/info";
import { labelContainerStyle, labelTextStyle, subHeaderStyle } from "./styles";

export const Label: React.FC<T_LabelProps> = ({
    htmlFor,
    children,
    className = labelContainerStyle,
    labelClassName = labelTextStyle,
    infoItems,
}) => {
    return (
        <Container className={className}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <label className={labelClassName} htmlFor={htmlFor}>
                    {children}
                </label>
                {infoItems?.componentType === "tooltip" && (
                    <Tooltip
                        header={infoItems.infoHeader}
                        description={infoItems.infoDescription}
                    />
                )}
            </div>
            {infoItems?.componentType === "subHeader" && (
                <Info className={subHeaderStyle}>
                    {infoItems.infoHeader && <span>{infoItems.infoHeader}</span>}
                    {infoItems.infoDescription && <p>{infoItems.infoDescription}</p>}
                </Info>
            )}
        </Container>
    );
};