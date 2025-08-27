/* import { T_FormValues } from "components/types/formLayout";
import { T_Payload } from "~/types"; */

export const mapDataForPayload = () => {};
/* export const mapDataForPayload = (
    formData: T_FormValues,
    userId: string,
    applicationId: string,
): T_Payload => {
    console.log("DataMapper", formData);
    const productId: string = "sweden-b2b-application"; // coming from API
    const questionSetId: string = "1"; // coming from API
    const answers = createAnswersArray(formData);

    return {
        userId,
        applicationId,
        productId,
        questionSetId,
        answers,
    };
}; */

export const createAnswersArray = () => {};

/* export const createAnswersArray = (formData: T_FormValues) => {
    return Object.entries(formData).map(([key, value]) => ({
        questionId: "1", //coming from API
        question: key,
        answer: JSON.stringify(value),
    }));
}; */
