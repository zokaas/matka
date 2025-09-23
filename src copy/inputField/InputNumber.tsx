import React from "react";
import { T_InputProps } from "./types";
import { Container } from "@ui/container";
import { inputContainerStyle, inputLabelStyle, inputFieldStyle } from "./styles";
import { ErrorMessage } from "@ui/error";
import { isNumber } from "./utils";
import { InputField } from "./InputField";

export const InputNumber: React.FC<T_InputProps> = ({
    fieldName,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    classNames,
    error,
    errorClassNames,
}) => {
    const [inputValue, setInputValue] = React.useState(value || "");

    const handleChange = (inputValue: string) => {
        if (isNumber(inputValue)) {
            setInputValue(inputValue);
            onChange(inputValue);
        }
    };
    return (
        <InputField
            label={label}
            fieldName={fieldName}
            onChange={handleChange}
            onBlur={onBlur}
            error={error}
            type={"text"}
            inputMode={"numeric"}
            placeholder={placeholder}
            value={inputValue}
            errorClassNames={errorClassNames}
            classNames={classNames}
        />
    );
};
