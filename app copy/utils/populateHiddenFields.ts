import { T_Answers } from "~/types";
import { T_CompanyDataFromSession } from "~/services";

export function populateHiddenFields(
    answers: T_Answers,
    sessionData: T_CompanyDataFromSession
): T_Answers {

    //predefined special cases, in strapi under hiddenInputQuestionParameter
    if (answers.has('SNICode')) {
        const existingAnswer = answers.get('SNICode')!;
        answers.set('SNICode', {
            ...existingAnswer,
            answer: sessionData.sniCode,
        });
    }

    if (answers.has('DistanceAgreement')) {
        const existingAnswer = answers.get('DistanceAgreement')!;
        answers.set('DistanceAgreement', {
                        ...existingAnswer,
            answer: true,
        });

    }
    return answers;
}