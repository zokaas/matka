import { T_ErrorClassNamesProps } from "@ui/error";
import { T_LabelInfo } from "@ui/label";

export type T_InputProps = {
    label: string;
    fieldName: string;
    onChange: (value: string) => void;
    onBlur: (value?: React.FocusEvent<HTMLInputElement, Element>) => void;
    placeholder?: string | null;
    value?: string;
    error: string;
    classNames?: T_InputFieldClassNames;
    errorClassNames?: T_ErrorClassNamesProps;
    infoItems?: T_LabelInfo | null;
};

export type T_InputFieldProps = T_InputProps & {
    type: "number" | "text";
    inputMode: "numeric" | "text";
};

export type T_InputFieldClassNames = {
    labelClassName?: string;
    fieldClassName?: string;
    containerClassName?: string;
};
