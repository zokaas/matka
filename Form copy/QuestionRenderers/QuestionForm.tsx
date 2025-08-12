import { processQuestions } from "components";
import { T_FormValue } from "components/types";
import React from "react";
import { T_Question } from "~/types";

export type T_QuestionFormProps = {
    questions: T_Question[];
    formValues: Record<string, T_FormValue>;
    handleInputChange: (questionParameter: string, value: T_FormValue) => void;
    errors: Record<string, string | undefined>;
};

export function QuestionForm({
    questions,
    formValues,
    handleInputChange,
    errors,
}: T_QuestionFormProps) {
    return <>{processQuestions(questions, formValues, handleInputChange, errors)}</>;
}
