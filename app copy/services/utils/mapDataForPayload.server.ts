import { T_Answers } from "~/types";

export type T_AnswerPayload = {
  questionId: string;
  question: string;
  answer: string | string[] | number | boolean;
};

export type T_Payload = {
  userId: string;
  applicationId: string;
  productId: string;
  questionSetId: string;
  answers: T_AnswerPayload[];
};

export const mapDataForPayload = (
  formValues: T_Answers,
  userId: string,
  applicationId: string,
  productId: string,
  questionSetId: string = "1"
): T_Payload => {
  const answers = createAnswersArray(formValues);

  return {
    userId,
    applicationId,
    productId,
    questionSetId,
    answers,
  };
};
/**
 * Converts form values map to an array of answer objects for API submission
 */
export const createAnswersArray = (formValues: T_Answers) => {
  return Array.from(formValues.values())
    .filter(item => {
      // Filter out empty values
      const answer = item.answer;
      if (answer === undefined || answer === null || answer === "") {
        return false;
      }
      // For arrays, filter out empty arrays
      if (Array.isArray(answer) && answer.length === 0) {
        return false;
      }
      return true;
    })
    .map(item => ({
      questionId: item.questionId,
      question: item.question,
      answer: typeof item.answer === 'object' ? JSON.stringify(item.answer) : String(item.answer)
    }));
};