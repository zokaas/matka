import React from "react";
import { Container } from "@ui/container";
import { T_SubheaderProps } from "./types";
import { subheaderContainerStyles, subheaderHeaderStyles, subheaderDescriptionStyles } from "./styles";

export const Subheader: React.FC<T_SubheaderProps> = ({
    header,
    description,
    classNames,
}) => {
    const containerStyles = classNames?.subheaderContainer || subheaderContainerStyles;
    const headerStyles = classNames?.subheaderHeader || subheaderHeaderStyles;
    const descriptionStyles = classNames?.subheaderDescription || subheaderDescriptionStyles;

    return (
        <Container className={containerStyles}>
            {header && <h4 className={headerStyles}>{header}</h4>}
            {description && <p className={descriptionStyles}>{description}</p>}
        </Container>
    );
};