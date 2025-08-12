import React, { useState } from "react";
import { T_TextareaProps } from "./types";
import { Container } from "@ui/container";
import { textareaStyle } from "./styles";

export const Textarea: React.FC<T_TextareaProps> = ({
    fieldName,
    label,
    onBlur,
    onChange,
    className,
    labelClassName,
    placeholder,
    value,
}) => {
    const [textAreaValue, setTextareaValue] = useState("");

    return (
        <Container className={textareaStyle}>
            <label className={labelClassName} htmlFor={fieldName}>
                {label}
            </label>
            <textarea
                name={fieldName}
                className={className}
                placeholder={placeholder}
                value={textAreaValue}
                onChange={(e) => {
                    onChange(e.target.value);
                    setTextareaValue(e.target.value);
                }}
                rows={4}
                onBlur={(e) => onBlur(e)}
            />
        </Container>
    );
};
