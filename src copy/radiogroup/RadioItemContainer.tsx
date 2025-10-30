import React from "react";
import { T_RadioItemContainerProps } from "./types/radioItemContainer";
import { Container } from "@ui/container";

// Wrap Container into RadioItemContainer for readability (for now)
export const RadioItemContainer: React.FC<T_RadioItemContainerProps> = ({
    className,
    children,
}) => {
    return <Container className={className}>{children}</Container>;
};
