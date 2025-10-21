import { T_AnswersMapValue, T_ParsedFormData } from "~/types";
import { 
    T_ErrorType, 
    T_ValidationRule, 
    T_ValidationResult,
    T_FieldValidationConfig
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

const valueToString = (value: T_AnswersMapValue): string => {
    if (value === null || value === undefined) {
        return '';
    }
    
    if (Array.isArray(value)) {
        return value.filter(v => v && String(v).trim()).join(',');
    }
    
    if (typeof value === 'string' && value.trim().length > 0) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return 'has_data';
            }
            if (typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                return 'has_data';
            }
        } catch {
            return String(value).trim();
        }
    }
    
    return String(value).trim();
};

export const validateField = (
    value: T_AnswersMapValue,
    config: T_FieldValidationConfig
): T_ValidationResult => {
    const { rules } = config;

    const stringValue = valueToString(value);
    
    for (const rule of rules) {
        const error = validateSingleRule(stringValue, rule);
        if (error) {
            return {
                isValid: false,
                error: error
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
        errorMessages.forEach(errorMsg => {
            rules.push({
                type: errorMsg.error,
                value: getValidationValueFromErrorType(errorMsg.error),
                message: errorMsg.message
            });
        });
    }
    
    if (additionalRules) {
        rules.push(...additionalRules);
    }
    
    rules.sort((a, b) => {
        if (a.type === 'isRequired') return -1;
        if (b.type === 'isRequired') return 1;
        return 0;
    });
    
    return {
        rules,
        isRequired: rules.some(rule => rule.type === 'isRequired')
    };
};

export const normalizeErrorMessages = (
    errorMessages?: Array<{ error: T_ErrorType; message: string }> | {
        data: Array<{
            id: number;
            attributes: {
                error: T_ErrorType;
                message: string;
                createdAt?: string;
                updatedAt?: string;
            }
        }>
    }
): Array<{ error: T_ErrorType; message: string }> => {
    if (!errorMessages) {
        return [];
    }
    
    if (Array.isArray(errorMessages)) {
        return errorMessages;
    }
    
    if ('data' in errorMessages && Array.isArray(errorMessages.data)) {
        return errorMessages.data.map(item => ({
            error: item.attributes.error,
            message: item.attributes.message
        }));
    }
    
    return [];
};


export const isFieldVisible = (
    fieldName: string,
    formData: T_ParsedFormData,
    formValues: Map<string, T_AnswersMapValue>
): boolean => {
    const parts = fieldName.split("::");
    if (parts.length !== 2) {
        return true;
    }
    
    const [parentField, childField] = parts;
    
    for (const [, questions] of formData.steps) {
        for (const question of questions) {
            if (question.question.questionParameter === parentField) {
                const depQuestion = question.question.dependentQuestion;
                if (depQuestion && depQuestion.questionParameter === childField) {
                    const parentValue = formValues.get(parentField);
                    return String(depQuestion.conditionValue) === String(parentValue);
                }
            }
        }
    }
    
    return false;
};