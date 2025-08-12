import { ChangeEvent } from "react";

export type T_TextareaProps = {
    label: string;
    fieldName: string;
    onChange: (value: string) => void;
    onBlur: (value?: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    value?: string;
};
