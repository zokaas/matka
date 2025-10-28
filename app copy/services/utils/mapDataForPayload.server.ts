import { T_AnswerObject, T_AnswerValue, T_Payload } from "~/types";

export function mapDataForPayload(
    answersEntries: Array<T_AnswerObject>,
    userId: string,
    applicationId: string,
    productId: string,
    questionSetId: string,
    companyName: string,
    orgNumber: string
): T_Payload {
    return {
        userId,
        applicationId,
        productId,
        questionSetId,
        companyName,
        orgNumber,
        answers: createAnswersArray(answersEntries),
    };
}

export function createAnswersArray(answersEntries: Array<T_AnswerObject>) {
    return answersEntries.map((entry) => ({
        questionId: entry.questionId,
        question: entry.question,
        answer: normalizeAnswerValue(entry.answer),
    }));
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
