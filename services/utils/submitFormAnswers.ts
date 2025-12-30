import { useSubmit } from "react-router";
import { T_AnswerObject } from "~/types";

export const submitFormAnswers = (
    formValues: Map<string, T_AnswerObject>,
    formId: string,
    submit: ReturnType<typeof useSubmit>
) => {
    const answersArray = Array.from(formValues.values());

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("answers", JSON.stringify(answersArray));
    formDataToSubmit.append("questionSetId", String(formId));

    submit(formDataToSubmit, { method: "post" });
};
