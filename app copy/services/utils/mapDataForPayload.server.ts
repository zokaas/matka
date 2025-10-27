import { T_Answer, T_AnswerEntry, T_AnswerValue, T_Payload } from "~/types";

export function createAnswersArray(answersEntries: T_AnswerEntry[]): T_Answer[] {
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

export function mapDataForPayload(
  answersEntries: T_AnswerEntry[],
  userId: string,
  applicationId: string,
  productId: string,
  questionSetId: string
): T_Payload {
  return {
    userId,
    applicationId,
    productId,
    questionSetId,
    answers: createAnswersArray(answersEntries),
  };
}