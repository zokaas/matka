import { T_ErrorClassNamesProps } from "@ui/error";

export type T_TextareaProps = {
    label: string;
    fieldName: string;
    onChange: (value: string) => void;
    onBlur: (value?: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
    placeholder?: string;
    classNames?: T_TextareaClassNamesProps;
    value?: string;
    error?: string;
    errorClassNames?: T_ErrorClassNamesProps;
};

export type T_TextareaClassNamesProps = {
    containerClassName?: string;
    labelClassName?: string;
    fieldClassName?: string;
};
