// ErrorMessage/index.tsx
import React from "react";
import { errorMessageStyle, errorTextStyle } from "./styles";

export interface T_ErrorMessageProps {
    error?: string | string[];
    className?: string;
}

export const ErrorMessage: React.FC<T_ErrorMessageProps> = ({
    error,
    className,
}) => {
    if (!error) return null;

    const errors = Array.isArray(error) ? error : [error];

    return (
        <div className={`${errorMessageStyle} ${className || ""}`}>
            {errors.map((err, index) => (
                <span key={index} className={errorTextStyle}>{err}</span>
            ))}
        </div>
    );
};