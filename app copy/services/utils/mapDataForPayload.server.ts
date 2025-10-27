import { T_AnswerValue } from "~/types";

export type T_Answer = {
  questionId: string;
  question: string;
  answer: T_AnswerValue;
};

export type T_AnswerEntry = {
  fieldName: string;
  questionId: string;
  question: string;
  answer: T_AnswerValue;
};

export type T_Payload = {
  userId: string;
  applicationId: string;
  productId: string;
  questionSetId: string;
  answers: T_Answer[];
};

/**
 * Converts form entries array from client to answers array for API submission.
 * Preserves arrays and objects without stringifying.
 * SERVER-ONLY
 */
export function createAnswersArray(answersEntries: T_AnswerEntry[]): T_Answer[] {
  return answersEntries.map((entry) => ({
    questionId: entry.questionId,
    question: entry.question,
    answer: normalizeAnswerValue(entry.answer),
  }));
}

/**
 * Normalizes answer values to proper types.
 * - Empty strings become empty strings (not null)
 * - Strings that are JSON are parsed back to objects/arrays
 * - Everything else passes through as-is
 * SERVER-ONLY
 */
function normalizeAnswerValue(value: T_AnswerValue): T_AnswerValue {
  if (typeof value === "string") {
    // Try to parse JSON strings (e.g., from BeneficialOwner component)
    if (value.startsWith("[") || value.startsWith("{")) {
      try {
        return JSON.parse(value);
      } catch {
        // If parsing fails, return as-is
        return value;
      }
    }
  }
  return value;
}

/**
 * Maps form values to complete API payload.
 * SERVER-ONLY
 */
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