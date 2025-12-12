import { T_Answers } from "~/types";
import { T_CompanyDataFromSession } from "~/services";

export function populateHiddenFields(
    answers: T_Answers,
    sessionData: T_CompanyDataFromSession
): T_Answers {

    //predefined special cases, in strapi under hiddenFieldQuestionParameter
    if (answers.has('sniCode')) {
        const existingAnswer = answers.get('sniCode')!;
        answers.set('sniCode', {
            ...existingAnswer,
            answer: sessionData.sniCode,
        });
    }

    if (answers.has('distanceAgreement')) {
        const existingAnswer = answers.get('distanceAgreement')!;
        answers.set('distanceAgreement', {
                        ...existingAnswer,
            answer: true,
        });

    }
    return answers;
}