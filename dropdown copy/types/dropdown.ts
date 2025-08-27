import { ReactNode } from "react";
import { T_ErrorClassNamesProps } from "@ui/error";

export interface ItemProps {
    value: string;
    children?: ReactNode;
    className?: string;
    showSelectedIndicator?: boolean;
    indicatorClassName?: string;
    multiSelect?: boolean;
    isSelected?: boolean;
    onChange?: (value: any) => void;
    currentValue?: any;
    onMultiSelectClick?: (value: string) => void;
}

export type ItemRef = HTMLDivElement;

export type T_DropDownOptionValue = string | Array<string> | number | boolean | undefined;

export type T_ClassNamesProps = {
    dropDownContainer?: string;
    dropDownLabel?: string;
    dropDownField?: string;
    dropdownValue?: string;
    dropDownIcon?: string;
    dropDownSelectionList?: string;
    dropDownViewport?: string;
    dropDownItem?: string;
    dropDownItemIndicator?: string;
    searchInput?: string;
};

export type T_DropDownProps = {
    label: string;
    fieldName: string;
    options: Array<T_DropDownOption> | null;
    showSelectedItemIcon: boolean;
    onChange: (value: T_DropDownOptionValue) => void;
    onBlur: (value?: React.FocusEvent<HTMLButtonElement, Element>) => void;
    placeholder?: string | null;
    classNames?: T_ClassNamesProps;
    errorClassNames?: T_ErrorClassNamesProps;
    error?: string;
    searchable?: boolean;
    multiSelect?: boolean;
    value?: T_DropDownOptionValue;
};

export type T_DropDownOption = {
    value: T_DropDownOptionValue;
    text: string;
};

export type T_MultiSelectProps = {
    label: string;
    fieldName: string;
    options: Array<T_DropDownOption> | null;
    onChange: (value: Array<string>) => void;
    onBlur?: (value?: React.FocusEvent<HTMLButtonElement, Element>) => void;
    placeholder?: string | null;
    classNames?: T_ClassNamesProps;
    errorClassNames?: T_ErrorClassNamesProps;
    error?: string;
    value?: Array<string>;
};