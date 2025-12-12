import { isNumber } from "@ui/input/utils";
import { T_AnswerValue, T_ParsedFormData } from "~/types";
import {
    T_ErrorType,
    T_ValidationRule,
    T_ValidationResult,
    T_FieldValidationConfig,
} from "~/types/validation";

const getValidationValueFromErrorType = (errorType: T_ErrorType): number | undefined => {
    switch (errorType) {
        case "maxLength20":
            return 20;
        case "maxLength100":
            return 100;
        case "maxLength500":
            return 500;
        case "maxLength1000":
            return 1000;
        default:
            return undefined;
    }
};

const isEmpty = (value: T_AnswerValue): boolean => {
    if (value == null || value === undefined) return true;

    if (typeof value === "string") {
        return value.trim() === "";
    }

    if (typeof value === "number") {
        return false;
    }

    if (typeof value === "boolean") {
        return false;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return true;

        return value.every((item) => {
            if (item == null) return true;
            if (typeof item === "string") return item.trim() === "";
            if (typeof item === "object") {
                return (
                    Object.keys(item).length === 0 ||
                    Object.values(item).every(
                        (v) => !v || (typeof v === "string" && v.trim() === "")
                    )
                );
            }
            return false;
        });
    }

    return false;
};

const valueAsString = (value: T_AnswerValue): string => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) return value.join(", ");
    return "";
};

const validateSingleRule = (value: T_AnswerValue, rule: T_ValidationRule): string | null => {
    if (rule.type === "mustBeChecked") {
        if (value !== true) {
            return rule.message;
        }
        return null;
    }

    if (rule.type === "isRequired") {
        return isEmpty(value) ? rule.message : null;
    }

    if (isEmpty(value)) {
        return null;
    }

    switch (rule.type) {
        case "numeric": {
            const stringValue = valueAsString(value);
            if (!isNumber(stringValue)) {
                return rule.message;
            }
            return null;
        }

        case "maxLength20":
        case "maxLength100":
        case "maxLength500":
        case "maxLength1000": {
            const stringValue = valueAsString(value);
            const maxLength = getValidationValueFromErrorType(rule.type);
            if (maxLength && stringValue.length > maxLength) {
                return rule.message;
            }
            return null;
        }

        default:
            console.warn(`Unknown validation rule type: ${rule.type}`);
            return null;
    }
};

export const validateField = (
    value: T_AnswerValue,
    config: T_FieldValidationConfig
): T_ValidationResult => {
    const { rules } = config;

    for (const rule of rules) {
        const error = validateSingleRule(value, rule);
        if (error) {
            return {
                isValid: false,
                error: error,
            };
        }
    }

    return { isValid: true };
};

export const createValidationConfig = (
    errorMessages?: Array<{ error: T_ErrorType; message: string }>,
    additionalRules?: T_ValidationRule[]
): T_FieldValidationConfig => {
    const rules: T_ValidationRule[] = [];

    if (errorMessages) {
        errorMessages.forEach((errorMessage) => {
            rules.push({
                type: errorMessage.error,
                value: getValidationValueFromErrorType(errorMessage.error),
                message: errorMessage.message,
            });
        });
    }

    if (additionalRules) {
        rules.push(...additionalRules);
    }

    rules.sort((a, b) => {
        if (a.type === "isRequired") return -1;
        if (b.type === "isRequired") return 1;
        return 0;
    });

    return {
        rules,
        isRequired: rules.some((rule) => rule.type === "isRequired"),
    };
};

export const isFieldVisible = (
    fieldName: string,
    formData: T_ParsedFormData,
    formValues: Map<string, T_AnswerValue>
): boolean => {
    const parts = fieldName.split("::");

    if (parts.length !== 2) {
        return true;
    }

    const [parentFieldName] = parts;

    for (const [, questions] of formData.steps) {
        for (const question of questions) {
            if (question.question.questionParameter === parentFieldName) {
                const depQuestion = question.question.dependentQuestion;

                if (!depQuestion) {
                    return false;
                }

                if (depQuestion.questionParameter === fieldName) {
                    const parentValue = formValues.get(parentFieldName);
                    const conditionValue = String(depQuestion.conditionValue);
                    const actualValue = String(parentValue);

                    return conditionValue === actualValue;
                }
            }
        }
    }

    return true;
};
