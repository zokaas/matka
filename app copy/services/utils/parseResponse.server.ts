import {
    T_Answers,
    T_ApiFormResponse,
    T_ComponentType,
    T_FormStepsKeys,
    T_FormStepsWithQuestions,
    T_ParsedFormData,
    T_ParsedFormGeneralFormProperties,
    T_ParsedStep,
    T_Question,
    T_QuestionData,
} from "~/types";
import { isCountryListUsed, isDependentQuestion } from "~/utils";
import { parseDynamicFields } from "./parseDynamicFields";

export const parseResponse = (apiResponse: T_ApiFormResponse): T_ParsedFormData => {
    const {
        id,
        product,
        formType,
        steps,
        button,
        footer,
        companyBlock,
        formHeader,
        sessionModal,
        questions,
    } = apiResponse;

    const parsedSteps: Array<T_ParsedStep> = [];

    for (const [k, v] of Object.entries(steps)) {
        const item: T_ParsedStep = {
            stepLabel: v,
            stepName: k,
        };
        parsedSteps.push(item);
    }

    let useCountryList: boolean = false;
    const stepKeyNames: Array<string> = Object.keys(steps);
    const parsedQuestionsByStep: T_FormStepsWithQuestions = new Map();
    const answers: T_Answers = new Map();

    questions.forEach((item) => {
        const stepKeyName = stepKeyNames[item.question.step - 1] as T_FormStepsKeys;

        const answerFieldName = item.question.questionParameter;
        answers.set(answerFieldName, "");

        item.question.dynamicField?.forEach((currentField) => {
            if (isDependentQuestion(currentField)) {
                answers.set(`${answerFieldName}::${currentField.questionParameter}`, "");
            }
        });

        const question: T_QuestionData = {
            componentType: item.question.componentType as T_ComponentType,
            step: item.question.step,
            questionParameter: item.question.questionParameter,
            questionLabel: item.question.questionLabel,
            placeholder: item.question.placeholder,
            options: item.question.options,
            errorMessages: item.question.errorMessages,
            ...parseDynamicFields(item),
        };

        const parsedQuestion: T_Question = {
            id: item.id,
            question,
        };

        /* Check only if country list is false. After getting the first 'true' value, 
        we are not interested in it, as we know that country list is needed at that point */
        if (!useCountryList) useCountryList = isCountryListUsed(parsedQuestion);

        if (parsedQuestionsByStep.has(stepKeyName)) {
            const stepData = parsedQuestionsByStep.get(stepKeyName);
            stepData?.push(parsedQuestion);
        } else parsedQuestionsByStep.set(stepKeyName, [parsedQuestion]);
    });

    const generalFormData: T_ParsedFormGeneralFormProperties = {
        steps: parsedSteps,
        button,
        footer,
        companyBlock,
        formHeader,
        sessionModal,
        useCountryList,
    };

    return {
        id,
        product,
        formType,
        generalFormData,
        steps: parsedQuestionsByStep,
        answers,
    };
};
