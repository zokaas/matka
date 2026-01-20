import React, { ReactNode } from "react";
export type WithdrawProps = {
    defaultValue: number;
    increment: number;
    min: number;
    max: number;
    onSubmit: (value: number) => void;
    plusIcon: ReactNode;
    minusIcon: ReactNode;
    unit: string;
    isLoading?: boolean;
    translation: {
        title: string;
        buttonText: string;
        iban: ReactNode;
        validationMax: string;
        validationInsufficientBalance: string;
    };
};
export type Form = {
    value: string;
};
export declare function Withdraw(props: WithdrawProps): React.JSX.Element;
