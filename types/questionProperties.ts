import { T_ErrorType } from "./validation";

export type T_ComponentType =
    | "Text"
    | "Textarea"
    | "RadioGroup"
    | "Select"
    | "Number"
    | "BeneficialOwner"
    | "MultiSelectDropdown"
    | "Checkbox"
    | "HiddenInput";

export type T_Option = {
    text: string;
    value: number;
};

export type T_CountryArray = Array<T_Option>;

export type T_InfoComponentType = "subHeader" | "tooltip";

export type T_QuestionErrorMessage = {
    error: T_ErrorType;
    message: string;
};
