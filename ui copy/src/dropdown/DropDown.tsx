import React from "react";
import Select from "react-select";
import { Container } from "@ui/container";
import { T_DropDownProps } from "./types";
import { ErrorMessage } from "@ui/error/Error";
import { dropDownContinerStyle } from ".";

export const DropDown: React.FC<T_DropDownProps> = ({
    fieldName,
    label,
    options,
    onChange,
    onBlur,
    className,
    placeholder,
    labelClassName,
    errorClassName,
    error,
}) => {
    return (
        <Container className={dropDownContinerStyle}>
            <label className={labelClassName} htmlFor={fieldName}>
                {label}
            </label>
            <Select
                options={options || undefined}
                onChange={(e) => onChange(`${e?.value}`)}
                onBlur={(e) => onBlur(e)}
                getOptionLabel={(option) => `${option.text}`}
                getOptionValue={(option) => `${option.value}`}
                placeholder={placeholder}
                className={className}
            />
            <ErrorMessage error={error} className={errorClassName} />
        </Container>
    );
};
