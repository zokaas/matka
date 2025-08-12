export type T_DropDownOptionValue = string | Array<string> | number | boolean | undefined;

export type T_DropDownProps = {
    label: string;
    fieldName: string;
    options: Array<T_DropDownOption> | null;
    onChange: (value: T_DropDownOptionValue) => void;
    onBlur: (value?: React.FocusEvent<HTMLInputElement, Element>) => void;
    placeholder?: string | null;
    className?: string;
    labelClassName?: string;
    errorClassName?: string;
    error?: string | string[];
};

export type T_DropDownOption = {
    value: T_DropDownOptionValue;
    text: string;
};
