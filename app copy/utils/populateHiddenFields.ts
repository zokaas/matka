import { T_Answers } from "~/types";

export function populateHiddenFields(answers: T_Answers, SNICode: string): T_Answers {
    //predefined special cases, in strapi under hiddenInputQuestionParameter
    if (answers.has("SNICode")) {
        const existingAnswer = answers.get("SNICode")!;
        answers.set("SNICode", {
            ...existingAnswer,
         questionLabel: "SNICode",
            answer: SNICode,
        });
    }

    if (answers.has("DistanceAgreement")) {
        const existingAnswer = answers.get("DistanceAgreement")!;
        answers.set("DistanceAgreement", {
            ...existingAnswer,
            questionLabel: "DistanceAgreement",
            answer: true,
            answerText: "Ja", //TODO: also translations, same as for checkbox in Question.tsx
        });
    }
    return answers;
}
