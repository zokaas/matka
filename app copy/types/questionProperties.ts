import { T_ErrorType } from "./validation";

export type T_ComponentType =
    | "Text"
    | "Textarea"
    | "RadioGroup"
    | "Select"
    | "Number"
    | "BeneficialOwner"
    | "MultiSelectDropdown";

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

export type T_ErrorMessageWithId = {
    id: number;
    attributes: T_QuestionErrorMessage;
};
