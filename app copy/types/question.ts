import { T_DependentQuestion } from "./formData";
import { T_ComponentType, T_Option, T_QuestionErrorMessage } from "./questionProperties";
import { T_AnalysisType, T_DynamicFieldInfo } from "./questionType";

export type T_QuestionData = {
    componentType: T_ComponentType;
    step: number;
    questionParameter: string;
    questionLabel: string;
    placeholder: string | null;
    options: Array<T_Option> | null;
    errorMessages?: Array<T_QuestionErrorMessage>;
    infoItems: Array<T_DynamicFieldInfo>;
    dependentQuestion: T_DependentQuestion | null;
    useCountryList: boolean | null;
    addBObutton: string | null;
    boMaxCount: number | null;
    namePlaceholder: string | null;
    nameParameter: string | null;
    nameQuestion: string | null;
    ssnPlaceholder: string | null;
    ssnParameter: string | null;
    ssnQuestion: string | null;
    ownershipPlaceholder: string | null;
    ownershipParameter: string | null;
    ownershipQuestion: string | null;
    countryPlaceholder: string | null;
    countryParameter: string | null;
    countryQuestion: string | null;
    pepParameter: string | null;
    pepQuestion: string | null;
    pepOptions: Array<T_Option> | null;
    automaticAnalysis: boolean | null;
    automaticAnalysisType: T_AnalysisType;
};

export type T_Question = {
    id: number;
    question: T_QuestionData;
};
