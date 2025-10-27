import {
    T_FormGeneralFormProperties,
    T_FormMainCommonProperties,
    T_FormStepsWithQuestions,
} from "./formDataPartials";
import { T_QuestionData } from "./question";
import { T_CountryArray } from "./questionProperties";
import { T_QuestionTypeBasic } from "./questionType";

export type T_FormGlobalProperties = T_FormMainCommonProperties & T_FormGeneralFormProperties;

/**
 * Core answer value type - supports all form input types
 */
export type T_AnswerValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | Record<string, string>[]
  | ""
  | undefined;

/**
 * Dropdown component value type (from UI library)
 */
export type T_DropDownOptionValue = string | number | string[];

/**
 * Utility type to normalize dropdown values to internal answer values
 */
export function normalizeDropdownValue(value: T_DropDownOptionValue): T_AnswerValue {
  if (Array.isArray(value)) {
    return value; // string[]
  }
  if (typeof value === "number") {
    return value;
  }
  return value; // string
}

/**
 * Answer object stored in the form values Map
 */
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

export type T_Answers = Map<string, T_AnswerObject>;

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
    questionSetId: string;
    applicationId: string;
};

export type T_Payload = {
    userId: string;
    applicationId: string;
    productId: string;
    questionSetId: string;
    answers: T_Answers[];
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
