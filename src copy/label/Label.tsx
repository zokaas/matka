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
    const tooltips = infoItems?.filter((item) => item.componentType === "tooltip") || [];
    const subHeaders = infoItems?.filter((item) => item.componentType === "subHeader") || [];

    return (
        <Container className={className}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <label className={labelClassName} htmlFor={htmlFor}>
                    {children}
                </label>
                {/* Render all tooltips */}
                {tooltips.map((tooltip, index) => (
                    <Tooltip header={tooltip.infoHeader} description={tooltip.infoDescription} />
                ))}
            </div>
            {/* Render all subHeaders */}
            {subHeaders.map((subHeader, index) => (
                <Info className={subHeaderStyle}>
                    {subHeader.infoHeader && <span>{subHeader.infoHeader}</span>}
                    {subHeader.infoDescription && <p>{subHeader.infoDescription}</p>}
                </Info>
            ))}
        </Container>
    );
};
