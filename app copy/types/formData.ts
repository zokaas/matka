import {
    T_FormGeneralFormProperties,
    T_FormMainCommonProperties,
    T_FormStepsWithQuestions,
} from "./formDataPartials";
import { T_QuestionTypeBasic } from "./questionType";

export type T_FormGlobalProperties = T_FormMainCommonProperties & T_FormGeneralFormProperties;

export type T_AnswersMapValue = string | Array<string> | number | boolean | undefined;

export type T_Answers = Map<string, T_AnswersMapValue>;

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
    countryList?: Array<string>;
    answers: T_Answers;
};
