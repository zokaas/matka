import React from "react";

export type T_ButtonVariants =
    | "neutral"
    | "blue"
    | "small"
    | "greenBeneficialOwner"
    | "redBeneficialOwner";

export type T_Button = {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: T_ButtonVariants;
    className?: string;
};
