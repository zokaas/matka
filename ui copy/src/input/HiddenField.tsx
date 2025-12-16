import React, { useEffect, useMemo } from "react";
import { T_HiddenFieldProps } from "./types";

export const HiddenField: React.FC<T_HiddenFieldProps> = ({
    fieldName,
    value,
    onChange,
    onBlur,
}) => {
    const serialized = useMemo(() => {
        if (value === undefined || value === null) return "";
        return String(value);
    }, [value]);

    useEffect(() => {
        onChange(value);
        onBlur();
    }, []);

    return <input type="hidden" name={fieldName} value={serialized} />;
};
