import {
    T_FormGeneralFormProperties,
    T_FormMainCommonProperties,
    T_FormStepsWithQuestions,
} from "./formDataPartials";
import { T_QuestionData } from "./question";
import { T_CountryArray } from "./questionProperties";
import { T_QuestionTypeBasic } from "./questionType";

export type T_FormGlobalProperties = T_FormMainCommonProperties & T_FormGeneralFormProperties;

export type T_AnswerValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | Record<string, string>[]
  | undefined;

export type T_AnswerObject = {
  questionId: string;
  question: string;
  answer: T_AnswerValue;
};

export type T_Answer = {
  questionId: string;
  question: string;
  answer: T_AnswerValue;
};

export type T_AnswerEntry = {
  fieldName: string;
  questionId: string;
  question: string;
  answer: T_AnswerValue;
};

export type T_Answers = Map<string, T_AnswerObject>;

export type T_Payload = {
  userId: string;
  applicationId: string;
  productId: string;
  questionSetId: string;
  answers: T_Answer[];
};

export type T_ApiFormResponse = T_FormGlobalProperties & {
    questions: Array<T_QuestionTypeBasic>;
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
    | "infoItems";

export type T_DependentQuestion =
    | (Pick<T_QuestionData, T_DependentQuestionPropertiesToPick> & {
          __component: "kyc.dependent-question";
          questionDescription: string | null;
          id: number;
          conditionValue: number | string;
          countryNameLang: string | null;
      })
    | null;

export type T_ParseDynamicFieldsResult = Omit<T_QuestionData, T_PropertiesToOmit> & {
    dependentQuestion: T_DependentQuestion;
};

export type T_SendFormDataResponse = {
    status: number;
    message: string;
};