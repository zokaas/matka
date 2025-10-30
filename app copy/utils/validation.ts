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

const isEmpty = (value: string): boolean => {
    return value.trim().length === 0;
};

const validateSingleRule = (value: string, rule: T_ValidationRule): string | null => {
    if (rule.type === "isRequired") {
        return isEmpty(value) ? rule.message : null;
    }

    if (isEmpty(value)) {
        return null;
    }

    switch (rule.type) {
        case "maxLength20":
        case "maxLength100":
        case "maxLength500":
        case "maxLength1000": {
            const maxLength = getValidationValueFromErrorType(rule.type);
            if (maxLength && value.length > maxLength) {
                return rule.message;
            }
            return null;
        }

        default:
            return null;
    }
};

const valueToString = (value: T_AnswerValue): string => {
    if (value === null || value === undefined) {
        return "";
    }

    // ✅ Handle arrays (multiselect)
    if (Array.isArray(value)) {
        // Filter out empty values and join
        const filtered = value.filter((v) => v && String(v).trim());
        // If array has items, return a non-empty string to pass "isRequired" check
        return filtered.length > 0 ? "has_items" : "";
    }

    // ✅ Handle string values (check if it's JSON)
    if (typeof value === "string" && value.trim().length > 0) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return "has_data";
            }
            if (typeof parsed === "object" && Object.keys(parsed).length > 0) {
                return "has_data";
            }
        } catch {
            // Not JSON, just return the trimmed string
            return String(value).trim();
        }
    }

    return String(value).trim();
};

export const validateField = (
    value: T_AnswerValue,
    config: T_FieldValidationConfig
): T_ValidationResult => {
    const { rules } = config;

    const stringValue = valueToString(value);

    for (const rule of rules) {
        const error = validateSingleRule(stringValue, rule);
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
        errorMessages.forEach((errorMsg) => {
            rules.push({
                type: errorMsg.error,
                value: getValidationValueFromErrorType(errorMsg.error),
                message: errorMsg.message,
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

export const normalizeErrorMessages = (
    errorMessages?:
        | Array<{ error: T_ErrorType; message: string }>
        | {
              data: Array<{
                  id: number;
                  attributes: {
                      error: T_ErrorType;
                      message: string;
                      createdAt?: string;
                      updatedAt?: string;
                  };
              }>;
          }
): Array<{ error: T_ErrorType; message: string }> => {
    if (!errorMessages) {
        return [];
    }

    if (Array.isArray(errorMessages)) {
        return errorMessages;
    }

    if ("data" in errorMessages && Array.isArray(errorMessages.data)) {
        return errorMessages.data.map((item) => ({
            error: item.attributes.error,
            message: item.attributes.message,
        }));
    }

    return [];
};

// ✅ Fixed function to check if a field should be visible
export const isFieldVisible = (
    fieldName: string,
    formData: T_ParsedFormData,
    formValues: Map<string, T_AnswerValue>
): boolean => {
    // If it's not a dependent field (no ::), it's always visible
    const parts = fieldName.split("::");
    if (parts.length !== 2) {
        return true; // Regular fields are always visible
    }

    // This is a dependent field with format "parent::child"
    const [parentFieldName, childFieldParam] = parts;

    // Find the parent question in the form data
    for (const [, questions] of formData.steps) {
        for (const question of questions) {
            // Check if this is the parent question
            if (question.question.questionParameter === parentFieldName) {
                const depQuestion = question.question.dependentQuestion;

                if (!depQuestion) {
                    // Parent has no dependent question, shouldn't happen
                    return false;
                }

                // ✅ The depQuestion.questionParameter already has the composite key
                // So we need to match the full fieldName
                if (depQuestion.questionParameter === fieldName) {
                    // Get the parent's current value
                    const parentValue = formValues.get(parentFieldName);

                    // Compare with the condition value
                    const conditionValue = String(depQuestion.conditionValue);
                    const actualValue = String(parentValue);

                    const isVisible = conditionValue === actualValue;

                    return isVisible;
                }
            }
        }
    }

    // If we can't find the field definition, assume it's visible to be safe
    return true;
};
