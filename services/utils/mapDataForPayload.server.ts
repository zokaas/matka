import { T_AnswerDisplayText, T_AnswerValue, T_Payload, T_SelectItem } from "~/types";

export function mapDataForPayload(payload: T_Payload): T_Payload {
    return {
        ...payload,
        answers: payload.answers.map((entry) => {
            let finalAnswer: T_AnswerValue =
                entry.answer as any;
            let finalAnswerText: T_AnswerDisplayText= entry.answerText;

            if (
                entry.answer &&
                typeof entry.answer === "object" &&
                !Array.isArray(entry.answer) &&
                "value" in entry.answer &&
                "text" in entry.answer
            ) {
                const item = entry.answer;
                finalAnswer = item.value;
                finalAnswerText = item.text;
            }
            if (
                Array.isArray(entry.answer) &&
                entry.answer.length > 0 &&
                typeof entry.answer[0] === "object" &&
                "value" in entry.answer[0]
            ) {
                const items = entry.answer as T_SelectItem[];
                finalAnswer = items.map((item) => item.value) as number[];
                finalAnswerText = items.map((item) => item.text);
            }

            return {
                questionId: entry.questionId,
                question: entry.question,
                questionLabel: entry.questionLabel,
                automaticAnalysis: entry.automaticAnalysis ?? false,
                type: entry.type,
                answer: finalAnswer,
                ...(finalAnswerText && { answerText: finalAnswerText }),
            };
        }),
    };
}
