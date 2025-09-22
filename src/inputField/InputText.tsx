import React from "react";
import { T_InputProps } from "./types";
import { InputField } from "./InputField";

export const InputText: React.FC<T_InputProps> = ({
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
    return (
        <InputField
            label={label}
            fieldName={fieldName}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            type={"text"}
            placeholder={placeholder}
            value={value}
            errorClassNames={errorClassNames}
            classNames={classNames}
        />
    );
};
