import {T_Payload } from "~/types";

export function mapDataForPayload(payload: T_Payload): T_Payload {
    return {
        ...payload,
        answers: payload.answers.map(entry => {
            let finalAnswer = entry.answer;
            let finalAnswerText = entry.answerText;

            if (Array.isArray(entry.answer) && 
                entry.answer.length > 0 && 
                typeof entry.answer[0] === 'object' && 
                'value' in entry.answer[0]) {
                
                finalAnswer = entry.answer.map((item: any) => item.value);
                finalAnswerText = entry.answer.map((item: any) => item.text);
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
        })
    };
}