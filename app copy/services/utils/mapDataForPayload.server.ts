import { T_Payload, T_MultiSelectItem } from "~/types";

export function mapDataForPayload(payload: T_Payload): T_Payload {
    return {
        ...payload,
        answers: payload.answers.map(entry => {
            let finalAnswer: number | string | boolean | number[] | string[] = entry.answer as any;
            let finalAnswerText: string | string[] | undefined = entry.answerText;

            // Handle single select object {value, text}
            if (
                entry.answer &&
                typeof entry.answer === 'object' &&
                !Array.isArray(entry.answer) &&
                'value' in entry.answer &&
                'text' in entry.answer
            ) {
                const item = entry.answer as T_MultiSelectItem;
                finalAnswer = item.value;
                finalAnswerText = item.text;
            }

            // Handle multiselect array of objects [{value, text}, ...]
            if (
                Array.isArray(entry.answer) && 
                entry.answer.length > 0 && 
                typeof entry.answer[0] === 'object' && 
                'value' in entry.answer[0]
            ) {
                const items = entry.answer as T_MultiSelectItem[];
                finalAnswer = items.map(item => item.value) as number[];
                finalAnswerText = items.map(item => item.text);
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