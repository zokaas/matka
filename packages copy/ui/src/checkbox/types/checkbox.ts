import { T_ErrorClassNamesProps } from "@ui/error";
import { T_LabelInfo } from "@ui/label";

export type T_CheckboxProps = {
    label: string;
    fieldName: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    onBlur?: (e?: React.FocusEvent<HTMLButtonElement, Element>) => void;
    classNames?: T_CheckboxClassNamesProps;
    errorClassNames?: T_ErrorClassNamesProps;
    error?: string;
    disabled?: boolean;
    infoItems?: T_LabelInfo[] | null;
};

export type T_CheckboxClassNamesProps = {
    checkboxContainer?: string;
    checkboxFieldContainer?: string;
    checkboxRoot?: string;
    checkboxIndicator?: string;
    checkboxLabel?: string;
};
