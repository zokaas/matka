import {
    T_ComponentType,
    T_InfoComponentType,
    T_Option,
    T_QuestionErrorMessage,
} from "./questionProperties";

export type T_DynamicFieldComponent =
    | "kyc.country-options"
    | "kyc.dependent-question"
    | "kyc.info"
    | "kyc.beneficial-owner";

// Component: "kyc.dependent-question"
export type T_DynamicFieldDependentQuestion = {
    conditionValue: number | string;
    calculateAnswer: boolean | null;
    automaticAnalysis: boolean | null;
    automaticAnalysisType: string;
    placeholder: string | null;
    options: Array<T_Option> | null;
    useCountryList: boolean | null;
    questionLabel: string;
    componentType: T_ComponentType;
    questionParameter: string;
    questionDescription: string | null;
    errorMessages: Array<T_QuestionErrorMessage>;
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
    pepPlaceholder: string;
    pepQuestion: string;
    pepOptions: { yes: T_Option; no: T_Option };
    errorMessages: Array<T_QuestionErrorMessage>;
};

// Component: "kyc.country-options"
export type T_DynamicFieldCountryOptions = {
    useCountryList: boolean;
};

export type T_DynamicFieldUnion =
    | T_DynamicFieldDependentQuestion
    | T_DynamicFieldInfo
    | T_DynamicFieldBeneficialOwner
    | T_DynamicFieldCountryOptions;

export type T_DynamicField<T = T_DynamicFieldUnion> = {
    id: number;
    __component: T_DynamicFieldComponent;
} & T;

export type T_ApiQuestionData = {
    questionLabel: string;
    step: number;
    componentType: string;
    calculateAnswer?: boolean | null;
    automaticAnalysis: boolean;
    automaticAnalysisType: T_AnalysisType;
    options: Array<T_Option> | null;
    placeholder: string | null;
    questionParameter: string;
    errorMessages?: Array<T_QuestionErrorMessage>;
    dynamicField?: Array<T_DynamicField>;
};

export type T_ApiQuestion = {
    id: number;
    question: T_ApiQuestionData;
};

export type T_AnalysisType = "Boolean" | "Int" | "String" | "" | null;
