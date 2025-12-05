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
        loginUrl,
        kycDoneUrl,
        steps,
        button,
        footer,
        companyBlock,
        formHeader,
        sessionModal,
        setOfQuestions,
    } = apiResponse;

    if (!setOfQuestions || !Array.isArray(setOfQuestions)) {
        console.error("Invalid API response - questions is missing or not an array:", apiResponse);
        throw new Error("Invalid API response: questions array is missing");
    }

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

    setOfQuestions.forEach((item) => {
        const stepKeyName = stepKeyNames[item.question.step - 1] as T_FormStepsKeys;
        const answerFieldName = item.question.questionParameter;

        const isBeneficialOwner = item.question.componentType === "BeneficialOwner";

        answers.set(answerFieldName, {
            questionId: String(item.id),
            question: answerFieldName,
            automaticAnalysis: item.question.automaticAnalysis ?? false,
            type:
                item.question.automaticAnalysis
                    ? item.question.automaticAnalysisType
                    : null,
            beneficialOwners: isBeneficialOwner ? true : undefined,
            answer: "",
        });

        item.question.dynamicField?.forEach((currentField) => {
            if (isDependentQuestion(currentField)) {
                const depField = `${answerFieldName}::${currentField.questionParameter}`;

                answers.set(depField, {
                    questionId: String(currentField.id),
                    question: depField,
                    automaticAnalysis: currentField.automaticAnalysis ?? false,
                    type:
                        currentField.automaticAnalysis
                            ? currentField.automaticAnalysisType
                            : null,
                    beneficialOwners: undefined,
                    answer: "",
                });
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
        loginUrl,
        kycDoneUrl,
        generalFormData,
        steps: parsedQuestionsByStep,
        answers,
    };
};
