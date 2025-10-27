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

    // Sort steps to ensure correct order
    const sortedStepEntries = Object.entries(steps).sort((a, b) => {
        // Extract step number from key (e.g., "step1", "step2", "step3")
        const numA = parseInt(a[0].replace('step', ''));
        const numB = parseInt(b[0].replace('step', ''));
        return numA - numB;
    });

    for (const [k, v] of sortedStepEntries) {
        const item: T_ParsedStep = {
            stepLabel: v,
            stepName: k,
        };
        parsedSteps.push(item);
    }

    console.log("=== PARSING FORM DATA ===");
    console.log("Total steps:", parsedSteps.length);
    console.log("Steps:", parsedSteps);
    console.log("Total questions:", questions.length);

    let useCountryList: boolean = false;
    const parsedQuestionsByStep: T_FormStepsWithQuestions = new Map();
    const answers: T_Answers = new Map();

    // Create a mapping of step number to step key name
    const stepNumberToKeyMap = new Map<number, string>();
    sortedStepEntries.forEach(([key], index) => {
        stepNumberToKeyMap.set(index + 1, key);
        console.log(`Step ${index + 1} maps to key: ${key}`);
    });

    questions.forEach((item) => {
        // Use the map instead of array index
        const stepKeyName = stepNumberToKeyMap.get(item.question.step) as T_FormStepsKeys;
        
        if (!stepKeyName) {
            console.error(`No step key found for step number ${item.question.step}`);
            return;
        }
        
        console.log(`Question "${item.question.questionParameter}" (step ${item.question.step}) assigned to ${stepKeyName}`);

        const field = item.question.questionParameter;

        answers.set(field, {
            questionId: String(item.id),
            question: field,
            answer: "",
        });

        // Seed dependent questions (if any)
        item.question.dynamicField?.forEach((currentField) => {
            if (isDependentQuestion(currentField)) {
                const depField = `${field}::${currentField.questionParameter}`;
                console.log(`  - Dependent question: ${depField}`);
                answers.set(depField, {
                    questionId: String(currentField.id),
                    question: depField,
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

        if (!useCountryList) useCountryList = isCountryListUsed(parsedQuestion);

        if (parsedQuestionsByStep.has(stepKeyName)) {
            const stepData = parsedQuestionsByStep.get(stepKeyName);
            stepData?.push(parsedQuestion);
        } else {
            parsedQuestionsByStep.set(stepKeyName, [parsedQuestion]);
        }
    });

    // Log final distribution
    console.log("=== QUESTIONS BY STEP (FINAL) ===");
    parsedQuestionsByStep.forEach((questions, stepName) => {
        console.log(`${stepName}: ${questions.length} questions`);
        questions.forEach(q => console.log(`  - ${q.question.questionParameter} (step: ${q.question.step})`));
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