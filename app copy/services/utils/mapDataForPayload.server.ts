import { T_AnswerObject, T_AnswerValue, T_Payload } from "~/types";

export function mapDataForPayload(
    answersEntries: Array<T_AnswerObject>,
    userId: string,
    applicationId: string,
    productId: string,
    questionSetId: string,
    organizationName: string,
    organizationNumber: string
): T_Payload {
    return {
        userId,
        applicationId,
        productId,
        questionSetId,
        organizationName,
        organizationNumber,
        answers: createAnswersArray(answersEntries),
    };
}

export function createAnswersArray(answersEntries: Array<T_AnswerObject>) {
    return answersEntries.map((entry) => {
        const baseAnswer = {
            questionId: entry.questionId,
            question: entry.question,
            automaticAnalysis: entry.automaticAnalysis ?? false,
            type: entry.automaticAnalysis === true ? entry.type : null,
            answer: normalizeAnswerValue(entry.answer),
        };

        if (entry.beneficialOwners === true) {
            return {
                ...baseAnswer,
                beneficialOwners: true,
            };
        }

        return baseAnswer;
    });
}

function normalizeAnswerValue(value: T_AnswerValue): T_AnswerValue {
    if (typeof value === "string") {
        if (value.startsWith("[") || value.startsWith("{")) {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
    }
    return value;
}