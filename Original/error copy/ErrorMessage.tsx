import React from "react";
import { Container } from "@ui/container";
import { T_ErrorMessageProps } from "./types";
import { Text } from "@ui/text";
import { errorContainerStyle, errorTextStyle } from "./styles";

export const ErrorMessage: React.FC<T_ErrorMessageProps> = ({ error, classNames }) => {
    if (!error) return null;

    const containerStyle = classNames?.errorContainerStyle
        ? classNames.errorContainerStyle
        : errorContainerStyle;

    const textStyle = classNames?.errorTextStyle ? classNames.errorTextStyle : errorTextStyle;

    return (
        <Container className={containerStyle}>
            <Text className={textStyle}>{error}</Text>
        </Container>
    );
};
