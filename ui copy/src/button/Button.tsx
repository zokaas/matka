import React from "react";
import { T_ButtonProps } from "./types";
import { buttonStyles } from "./styles";

export const Button: React.FC<T_ButtonProps> = ({
    label,
    onClick,
    type,
    className,
    disabled,
    ariaLabel,
}) => {
    const btnClassNames = className || buttonStyles;
    return (
        <button
            type={type}
            disabled={disabled}
            className={btnClassNames}
            onClick={() => onClick?.()}
            aria-label={ariaLabel}>
            {label}
        </button>
    );
};
