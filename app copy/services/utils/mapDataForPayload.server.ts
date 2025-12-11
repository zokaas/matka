import { T_AnswerObject, T_AnswerValue, T_Payload } from "~/types";

export function mapDataForPayload(payload: T_Payload): T_Payload {
    return {
        userId: payload.userId,
        applicationId: payload.applicationId,
        productId: payload.productId,
        questionSetId: payload.questionSetId,
        organizationName: payload.organizationName,
        organizationNumber: payload.organizationNumber,
        bankIdAuth: {
            givenName: payload.bankIdAuth.givenName,
            familyName: payload.bankIdAuth.familyName,
            ssn: payload.bankIdAuth.ssn,
            iat: payload.bankIdAuth.iat,
        },
        answers: createAnswersArray(payload.answers),
    };
}

export function createAnswersArray(answersEntries: Array<T_AnswerObject>) {
    return answersEntries.map((entry) => {
        const baseAnswer = {
            questionId: entry.questionId,
            question: entry.question,
            questionLabel: entry.questionLabel,
            ...(entry.calculateAnswer === true && { calculateAnswer: true }),
            automaticAnalysis: entry.automaticAnalysis ?? false,
            type: entry.type || "",
            answer: normalizeAnswerValue(entry.answer),
            ...(entry.answerText !== undefined && { answerText: entry.answerText }),
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
