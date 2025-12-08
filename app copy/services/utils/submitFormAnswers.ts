import { useSubmit } from "react-router";
import { T_AnswerObject, T_ParsedFormData } from "~/types";

export const submitFormAnswers = async (
    formValues: Map<string, T_AnswerObject>,
    formId: string,
    formData: T_ParsedFormData,
    submit: ReturnType<typeof useSubmit>
) => {
    const answersArray = Array.from(formValues.entries()).map(([fieldName, value]) => {
        let answerText: string | undefined;

        for (const [, questions] of formData.steps) {
            const question = questions.find(
                (q) =>
                    q.question.questionParameter === fieldName ||
                    q.question.dependentQuestion?.questionParameter === fieldName
            );

            if (question) {
                const questionData =
                    fieldName.includes("::") &&
                    question.question.dependentQuestion?.questionParameter === fieldName
                        ? question.question.dependentQuestion
                        : question.question;

                if (questionData) {
                    const componentType = questionData.componentType;
                    const options = questionData.useCountryList
                        ? formData.countryList
                        : questionData.options;

                    switch (componentType) {
                        case "Select":
                        case "RadioGroup": {
                            if (options) {
                                const option = options.find(
                                    (opt) => String(opt.value) === String(value.answer)
                                );
                                answerText = option?.text || undefined;
                            }
                            break;
                        }

                        case "MultiSelectDropdown": {
                            if (Array.isArray(value.answer) && options) {
                                const selectedTexts = value.answer
                                    .map((v) => {
                                        const option = options.find(
                                            (opt) => String(opt.value) === String(v)
                                        );
                                        return option?.text;
                                    })
                                    .filter(Boolean);
                                answerText =
                                    selectedTexts.length > 0 ? selectedTexts.join(", ") : undefined;
                            }
                            break;
                        }

                        case "Checkbox": {
                            answerText = value.answer === true ? "Ja" : "Nej";
                            break;
                        }

                        case "Text":
                        case "Textarea":
                        case "Number":
                        case "BeneficialOwner": {
                            answerText = undefined;
                            break;
                        }
                    }
                }
                break;
            }
        }

        return {
            questionId: value.questionId,
            question: value.question,
            questionLabel: value.questionLabel,
            answer: value.answer,
            answerText: answerText,
            automaticAnalysis: value.automaticAnalysis,
            type: value.type,
            beneficialOwners: value.beneficialOwners,
        };
    });

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("answers", JSON.stringify(answersArray));
    formDataToSubmit.append("questionSetId", String(formId));

    submit(formDataToSubmit, { method: "post" });
};
