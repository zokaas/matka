import React, { useState } from "react";
import { T_FilterProps } from "./types";
import { Container } from "@ui/container";
import { filterContainerStyle, filterInputStyle } from "./styles";
import { DEFAULT_PLACEHOLDER } from "./filter.constants";

export const Filter: React.FC<T_FilterProps> = ({
    placeholder,
    fieldName,
    classNames,
    onChange,
}) => {
    const containerStyle = classNames?.containerCLassName || filterContainerStyle;
    const inputStyle = classNames?.inputClassName || filterInputStyle;
    return (
        <Container className={containerStyle}>
            <input
                name={fieldName}
                id={fieldName}
                type="text"
                className={inputStyle}
                placeholder={placeholder || DEFAULT_PLACEHOLDER}
                onChange={(e) => {
                    e.preventDefault();
                    onChange(e.target.value);
                }}
                // This is needed to stop Radix from staling keyboar focus used for typeahead
                onKeyDown={(e) => e.stopPropagation()}
            />
        </Container>
    );
};
