import { ReactNode } from "react";
import { T_ErrorClassNamesProps } from "@ui/error";
import { T_LabelInfo } from "@ui/label";

export interface ItemProps {
    value: string;
    children?: ReactNode;
    className?: string;
    showSelectedIndicator?: boolean;
    indicatorClassName?: string;
    disabled?: boolean;
}

export type ItemRef = HTMLDivElement;

export type T_DropDownOptionValue = string | number ;

export type T_DropDownClassNamesProps = {
    dropDownContainer?: string;
    dropDownLabel?: string;
    dropDownField?: string;
    dropDownValue?: string;
    dropDownIcon?: string;
    dropDownSelectionList?: string;
    dropDownViewport?: string;
    dropDownItem?: string;
    multiSelectListStyle?: string;
    dropDownItemIndicator?: string;
    filterContainer?: string;
    filterInput?: string;
};

export type T_DropDownProps = {
    label: string;
    fieldName: string;
    value: T_DropDownOption;
    options: Array<T_DropDownOption> | null;
    showSelectedItemIcon: boolean;
    onChange: (value: T_DropDownOptionValue, text: string) => void;
    onBlur: (value?: React.FocusEvent<HTMLButtonElement, Element>) => void;
    placeholder?: string | null;
    classNames?: T_DropDownClassNamesProps;
    errorClassNames?: T_ErrorClassNamesProps;
    error?: string;
    searchEnabled?: boolean;
    searchPlaceholder?: string;
    searchNoResultsText?: string;
    infoItems?: T_LabelInfo[] | null;
};

export type T_DropDownOption = {
    id?: number;
    value: T_DropDownOptionValue;
    text: string;
};
