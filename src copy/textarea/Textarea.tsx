import React from "react";
import { T_TextareaProps } from "./types";
import { Container } from "@ui/container";
import { textareaContainerStyle, textareaFieldStyle } from "./styles";
import { ErrorMessage } from "@ui/error";
import { Label } from "@ui/label";

export const Textarea: React.FC<T_TextareaProps> = ({
    fieldName,
    label,
    onBlur,
    onChange,
    classNames,
    placeholder,
    value,
    error,
    errorClassNames,
    infoItems,
}) => {
    const containerStyle = classNames?.containerClassName || textareaContainerStyle;
    const fieldStyle = classNames?.fieldClassName || textareaFieldStyle;

    return (
        <Container className={containerStyle}>
            <Label htmlFor={fieldName} infoItems={infoItems}>
                {label}
            </Label>
            <textarea
                name={fieldName}
                className={fieldStyle}
                placeholder={placeholder || undefined}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                onBlur={(e) => onBlur(e)}
            />
            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};
