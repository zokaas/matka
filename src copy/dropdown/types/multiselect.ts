import { T_ErrorClassNamesProps } from "@ui/error";
import { T_DropDownClassNamesProps, T_DropDownOption } from "./dropdown";
import { T_LabelInfo } from "@ui/label";

export type T_MultiSelectProps = {
    label: string;
    fieldName: string;
    options: Array<T_DropDownOption> | null;
    onChange: (items: Array<T_DropDownOption>) => void;
    value: Array<T_DropDownOption>;
    onBlur?: (value?: React.FocusEvent<HTMLButtonElement, Element>) => void;
    placeholder?: string | null;
    classNames?: T_MultiSelectClassNamesProps;
    errorClassNames?: T_ErrorClassNamesProps;
    error?: string;
    searchEnabled?: boolean;
    searchPlaceholder?: string;
    searchNoResultsText?: string;
    infoItems?: T_LabelInfo[] | null;
};

export type T_MultiSelectClassNamesProps = T_DropDownClassNamesProps & {
    // additional multiSelect properties
    multiSelectTagsContainer?: string;
    multiSelectTag?: string;
    multiSelectTagRemove?: string;
    multiSelectCheckbox?: string;
    multiSelectOptionButton?: string;
    multiSelectOptionText?: string;
    multiSelectFieldContainer?: string;
};
