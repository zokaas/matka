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

export type T_ErrorType = "isRequired"; // TODO: Add more when known

export type T_ErrorMessage = {
    error: T_ErrorType;
    message: string;
    createdAt?: string; // TODO: Not cleaned from all places, thus optional here to preserve compatibility
    updatedAt?: string; // TODO: Not cleaned from all places, thus optional here to preserve compatibility
};

export type T_InfoComponentType = "subHeader" | "tooltip";

export type T_Info = {
    id: number;
    __component: "kyc.info";
    componentType: T_InfoComponentType;
    infoHeader: string | null;
    infoDescription: string | null;
};

export type T_ErrorMessageWithId = {
    id: number;
    attributes: T_ErrorMessage;
};
