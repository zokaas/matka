import React from "react";
import { T_LabelProps } from "./types";
import { Container } from "@ui/container";
import { Tooltip } from "@ui/tooltip";
import { Info } from "@ui/info";
import {
    labelContainerStyle,
    labelTextStyle,
    subHeaderStyle,
    labelWithTooltipStyle,
    tooltipWrapperStyle,
} from "./styles";

export const Label: React.FC<T_LabelProps> = ({
    htmlFor,
    children,
    className = labelContainerStyle,
    labelClassName = labelTextStyle,
    infoItems,
}) => {
    const items = infoItems || [];

    const tooltip = items.find((item) => item.componentType === "tooltip");
    const subHeader = items.find((item) => item.componentType === "subheader");

    return (
        <Container className={className}>
            <div className={labelWithTooltipStyle}>
                <label className={labelClassName} htmlFor={htmlFor}>
                    {children}
                </label>
                {tooltip && (
                    <div className={tooltipWrapperStyle}>
                        <Tooltip
                            header={tooltip.infoHeader}
                            description={tooltip.infoDescription}
                        />
                    </div>
                )}
            </div>

            {subHeader && (
                <Info className={subHeaderStyle}>
                    {subHeader.infoHeader && <span>{subHeader.infoHeader}</span>}
                    {subHeader.infoDescription && <p>{subHeader.infoDescription}</p>}
                </Info>
            )}
        </Container>
    );
};
