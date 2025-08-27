import { T_QuestionData } from "~/types/questionType";
import { E_ComponentTypes, T_QuestionsProps } from "./questions";

export type T_QuestionProps = {
    questionType: (typeof E_ComponentTypes)[keyof typeof E_ComponentTypes];
    questionProps: T_QuestionsProps;
    question: T_QuestionData;
};
