import React from "react";
import { T_InputFieldProps } from "./types";
import { Container } from "@ui/container";
import { inputContainerStyle, inputLabelStyle, inputFieldStyle } from "./styles";
import { ErrorMessage } from "@ui/error";
import { Label } from "@ui/label";

export const InputField: React.FC<T_InputFieldProps> = ({
    fieldName,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    classNames,
    error,
    errorClassNames,
    type,
    infoItems
}) => {
    const containerStyle = inputContainerStyle;
    const labelStyle = classNames?.labelClassName || inputLabelStyle;
    const fieldStyle = classNames?.fieldClassName || inputFieldStyle;
    const fieldSetContainerStyle = classNames?.containerClassName || "";

    return (
        <Container className={containerStyle}>
            <Container className={fieldSetContainerStyle}>
            <Label 
                htmlFor={fieldName}
                labelClassName={labelStyle}
                infoItems={infoItems}
            >
                {label}
            </Label>
                <input
                    name={fieldName}
                    id={fieldName}
                    type={type}
                    className={fieldStyle}
                    placeholder={placeholder || undefined}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={(e) => onBlur(e)}
                />
            </Container>
            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};
