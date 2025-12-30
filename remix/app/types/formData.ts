import {
    T_FormGeneralFormProperties,
    T_FormMainCommonProperties,
    T_FormStepsWithQuestions,
} from "./formDataPartials";
import { T_QuestionData } from "./question";
import { T_CountryArray } from "./questionProperties";
import { T_AnalysisType, T_ApiQuestion } from "./questionType";

export type T_FormGlobalProperties = T_FormMainCommonProperties & T_FormGeneralFormProperties;

export type T_SelectItem = {
    value: number | string;
    text: string;
};

export type T_BeneficialOwner = Record<string, string | number>;

export type T_AnswerValue =
    | string
    | number
    | boolean
    | Array<string>
    | Array<number>
    | Array<T_SelectItem | T_BeneficialOwner>
    | T_SelectItem
    | undefined;

export type T_AnswerDisplayText = string | Array<string> | undefined;

export type T_AnswerObject = {
    questionId: string;
    question: string;
    questionLabel: string;
    automaticAnalysis: boolean;
    type: T_AnalysisType;
    answer: T_AnswerValue;
    answerText?: T_AnswerDisplayText;
};

export type T_Answers = Map<string, T_AnswerObject>;

export type T_BankIdAuth = {
    givenName: string;
    familyName: string;
    ssn: string;
    iat: number;
};

export type T_Payload = {
    userId: string;
    applicationId: string;
    applicationUuid: string | null;
    productId: string;
    questionSetId: string;
    organizationName: string;
    organizationNumber: string;
    bankIdAuth: T_BankIdAuth;
    answers: Array<T_AnswerObject>;
};

export type T_ApiFormResponse = T_FormGlobalProperties & {
    setOfQuestions: Array<T_ApiQuestion>;
};

export type T_ParsedStep = {
    stepName: string;
    stepLabel: string;
};

export type T_ParsedFormGeneralFormProperties = Omit<T_FormGeneralFormProperties, "steps"> & {
    useCountryList: boolean;
    steps: Array<T_ParsedStep>;
};

export type T_ParsedFormData = T_FormMainCommonProperties & {
    generalFormData: T_ParsedFormGeneralFormProperties;
    steps: T_FormStepsWithQuestions;
    countryList?: T_CountryArray;
    answers: T_Answers;
};

type T_PropertiesToOmit =
    | "componentType"
    | "step"
    | "questionParameter"
    | "questionLabel"
    | "placeholder"
    | "options"
    | "errorMessages"
    | "dependentQuestion";

type T_DependentQuestionPropertiesToPick =
    | "componentType"
    | "options"
    | "questionLabel"
    | "questionParameter"
    | "useCountryList"
    | "errorMessages"
    | "placeholder"
    | "infoItems"
    | "automaticAnalysis"
    | "automaticAnalysisType";

export type T_DependentQuestion =
    | (Pick<T_QuestionData, T_DependentQuestionPropertiesToPick> & {
          __component: "kyc.dependent-question";
          questionDescription: string | null;
          id: number;
          conditionValue: number | string;
      })
    | null;

export type T_ParseDynamicFieldsResult = Omit<T_QuestionData, T_PropertiesToOmit> & {
    dependentQuestion: T_DependentQuestion;
};

export type T_SendFormDataResponse = {
    status: string;
    message: string;
};
