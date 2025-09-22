//TODO: check imports
import { T_QuestionData } from "~/types/question";
import { E_ComponentTypes, T_QuestionsProps } from "./questions";
import { T_CountryArray, T_DependentQuestion } from "~/types";

export type T_QuestionProps = {
    questionType: (typeof E_ComponentTypes)[keyof typeof E_ComponentTypes];
    questionProps: T_QuestionsProps;
    question: T_QuestionData | T_DependentQuestion;
    countryList?: T_CountryArray;
};
