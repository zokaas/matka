import React from "react";
import { T_TextareaProps } from "./types";
import { Container } from "@ui/container";
import { textareaContainerStyle, textareaLabelStyle, textareaFieldStyle } from "./styles";
import { ErrorMessage } from "@ui/error";

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
}) => {
    const containerStyle = classNames?.containerClassName || textareaContainerStyle;
    const labelStyle = classNames?.labelClassName || textareaLabelStyle;
    const fieldStyle = classNames?.fieldClassName || textareaFieldStyle;

    return (
        <Container className={containerStyle}>
            <label className={labelStyle} htmlFor={fieldName}>
                {label}
            </label>
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
