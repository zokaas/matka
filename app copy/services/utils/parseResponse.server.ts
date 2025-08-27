import {
    T_Answers,
    T_ApiFormResponse,
    T_FormStepsKeys,
    T_FormStepsWithQuestions,
    T_ParsedFormData,
    T_ParsedFormGeneralFormProperties,
    T_ParsedStep,
} from "~/types";
import {
    T_DynamicField,
    T_DynamicFieldBeneficialOwner,
    T_DynamicFieldDependentQuestion,
    T_DynamicFieldInfo,
} from "~/types/questionType";

const isDependentQuestion = (
    question: T_DynamicField<
        T_DynamicFieldDependentQuestion | T_DynamicFieldInfo | T_DynamicFieldBeneficialOwner
    >
): question is T_DynamicField<T_DynamicFieldDependentQuestion> => {
    return question.__component === "kyc.dependent-question";
};

const getUseCountryList = (
    dynamicField:
        | Array<
              T_DynamicField<
                  | T_DynamicFieldDependentQuestion
                  | T_DynamicFieldInfo
                  | T_DynamicFieldBeneficialOwner
              >
          >
        | undefined
): boolean => {
    if (!dynamicField) return false;

    const isCountryListNeeded = dynamicField.map((item) => {
        if (isDependentQuestion(item)) {
            return item.useCountryList ? true : false;
        } else {
            return false;
        }
    });
    //return true if even one true is found
    return isCountryListNeeded.some((value) => value === true);
};

export const parseResponse = (apiResponse: T_ApiFormResponse): T_ParsedFormData => {
    const { id, product, formType, steps, button, footer, companyBlock, formHeader, questions } =
        apiResponse;

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

        /* Check only if country list is false. After getting the first 'true' value, 
        we are not interested in it, as we know that country list is needed at that point */
        if (!useCountryList) useCountryList = getUseCountryList(item.question.dynamicField);
        const answerFieldName = item.question.questionParameter;
        answers.set(answerFieldName, "");

        item.question.dynamicField?.forEach((currentField) => {
            if (isDependentQuestion(currentField)) {
                answers.set(`${answerFieldName}::${currentField.questionParameter}`, "");
            }
        });

        if (parsedQuestionsByStep.has(stepKeyName)) {
            const stepData = parsedQuestionsByStep.get(stepKeyName);
            stepData?.push(item);
        } else parsedQuestionsByStep.set(stepKeyName, [item]);
    });

    const generalFormData: T_ParsedFormGeneralFormProperties = {
        steps: parsedSteps,
        button,
        footer,
        companyBlock,
        formHeader,
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
