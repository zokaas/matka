import { T_ErrorClassNamesProps } from "@ui/error";
import { T_ClassNamesProps, T_DropDownOption, T_DropDownOptionValue } from "./dropdown";

export type T_MultiSelectProps = {
    label: string;
    fieldName: string;
    options: Array<T_DropDownOption> | null;
    onChange: (value: T_DropDownOptionValue) => void;
    onBlur?: (value?: React.FocusEvent<HTMLButtonElement, Element>) => void;
    showSelectedItemIcon: boolean;
    placeholder?: string | null;
    classNames?: T_ClassNamesProps;
    errorClassNames?: T_ErrorClassNamesProps;
    error?: string;
    searchEnabled?: boolean;
    searchPlaceholder?: string;
    searchNoResultsText?: string;
};