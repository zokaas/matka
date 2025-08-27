import { T_FormValue, T_FormValues } from "components/types";
import { T_Question } from "~/types";

// Helper function to parse form values safely
export const parseFormValues = (formData: FormData): T_FormValues => {
    const formValues: Record<string, T_FormValue> = {};

    // Iterate over form data and safely assign types
    formData.forEach((value, key) => {
        if (key === "beneficialOwners" || key === "questions") {
            try {
                formValues[key] = JSON.parse(value as string);
            } catch (error) {
                console.error(`Error parsing ${key}:`, error);
                // Don't silently fail - assign a default value or the original
                formValues[key] = [];
            }
        } else {
            formValues[key] = value as string;
        }
    });
    console.log("Parsed Form Values: ", formValues);
    return formValues;
};

export const appendFormData = (data: T_FormValues): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (typeof value === "object" || Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
};

export const getQuestionsForStep = (questions: T_Question[], stepIndex: number): T_Question[] => {
    return questions.filter((question: T_Question) => question.rawData.step === stepIndex + 1);
};

export const initializeFormValues = (
    questions: T_Question[],
    currentValues: T_FormValues,
): T_FormValues => {
    const updatedValues = { ...currentValues };

    questions.forEach((question: T_Question) => {
        const { questionParameter } = question.rawData;
        if (questionParameter && !updatedValues[questionParameter]) {
            updatedValues[questionParameter] = "";
        }
    });

    return updatedValues;
};
