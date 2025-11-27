import { useSubmit } from "react-router";
import { T_AnswerObject } from "~/types";

export const submitFormAnswers = async (
    formValues: Map<string, T_AnswerObject>,
    formId: string,
    submit: ReturnType<typeof useSubmit>
) => {
    const answersArray = Array.from(formValues.entries()).map(([, value]) => ({
        questionId: value.questionId,
        question: value.question,
        answer: value.answer,
        automaticAnalysis: value.automaticAnalysis,
        type: value.type,
    }));

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("answers", JSON.stringify(answersArray));
    formDataToSubmit.append("questionSetId", String(formId));

    submit(formDataToSubmit, { method: "post" });
};
