import { T_LabelInfo } from "@ui/label";

export type T_Option = {
    text: string;
    value: number | string;
};

export type T_ClassNamesProps = {
    radioRoot?: string;
    radioItem?: string;
    radioLabel?: string;
    radioItemLabel?: string;
    radioItemContainer?: string;
    radioIndicator?: string;
    errorContainer?: string;
};

export type T_RadioGroupProps = {
    label: string;
    fieldName: string;
    onChange: (value: string) => void;
    options: Array<T_Option>;
    defaultValue?: string;
    classNames?: T_ClassNamesProps;
    infoItems?: T_LabelInfo[] | null;
};
