//TODO: check questionType.ts for obsolete code

export type T_DynamicFieldComponent =
    | "kyc.country-options"
    | "kyc.dependent-question"
    | "kyc.info"
    | "kyc.beneficial-owner";

export type T_DynamicField<T = never> = {
    id: number;
    __component: T_DynamicFieldComponent;
} & T;

export type T_ComponentType =
    | "Text"
    | "Textarea"
    | "RadioGroup"
    | "Select"
    | "Number"
    | "BeneficialOwner"
    | "MultiSelectDropdown";

export type T_InfoComponentType = "subHeader" | "tooltip";
export type T_ErrorType = "isRequired"; // TODO: Add more when known

export type T_QuestionErrorMessage = {
    error: T_ErrorType;
    message: string;
    createdAt?: string; // TODO: Not cleaned from all places, thus optional here to preserve compatibility
    updatedAt?: string; // TODO: Not cleaned from all places, thus optional here to preserve compatibility
};

export type T_ErrorMessageWithId = {
    id: number;
    attributes: T_QuestionErrorMessage;
};

export type T_Option = {
    text: string;
    value: number;
};

// Component: "kyc.dependent-question"
export type T_DynamicFieldDependentQuestion = {
    conditionValue: number;
    placeholder: string | null;
    options: Array<T_Option> | null;
    useCountryList: boolean | null;
    questionLabel: string;
    componentType: T_ComponentType;
    questionParameter: string;
    questionDescription: string | null;
    countryNameLang: string | null;
    error_messages: {
        data: Array<T_ErrorMessageWithId>;
    };
};

// Component: "kyc.info"
export type T_DynamicFieldInfo = {
    infoHeader: string | null;
    infoDescription: string | null;
    componentType: T_InfoComponentType;
};

// Component: "kyc.beneficial-owner"
export type T_DynamicFieldBeneficialOwner = {
    useCountryList: boolean | null;
    addBObutton: string;
    namePlaceholder: string;
    ssnPlaceholder: string;
    ownershipPlaceholder: string;
    countryPlaceholder: string;
    nameParameter: string;
    nameQuestion: string;
    ssnParameter: string;
    ssnQuestion: string;
    ownershipParameter: string;
    ownershipQuestion: string;
    countryParameter: string;
    countryQuestion: string;
    countryListLang: string;
    errorMessages: {
        data: Array<T_ErrorMessageWithId>;
    };
};

export type T_QuestionData = {
    questionLabel: string;
    step: number;
    componentType: string;
    options: Array<T_Option> | null;
    placeholder: string | null;
    questionParameter: string;
    errorMessages?: Array<T_QuestionErrorMessage>;
    dynamicField?: Array<
        T_DynamicField<
            T_DynamicFieldDependentQuestion | T_DynamicFieldInfo | T_DynamicFieldBeneficialOwner
        >
    >;
};

//TODO: T_QuestionTypeBasic shouldn't be in use anymore
export type T_QuestionTypeBasic = {
    id: number;
    question: T_QuestionData;
};
