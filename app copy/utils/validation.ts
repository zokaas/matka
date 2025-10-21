// app/utils/validation.ts
import { T_AnswersMapValue } from "~/types";
import { 
    T_ErrorType, 
    T_ValidationRule, 
    T_ValidationResult, 
    T_FormValidationResult,
    T_ValidationErrors,
    T_FieldValidationConfig
} from "~/types/validation";

/**
 * Extract validation value from error type
 */
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

/**
 * Validates a single rule against a value
 */
const validateSingleRule = (value: string, rule: T_ValidationRule): string | null => {
    switch (rule.type) {
        case "isRequired":
            return value.length === 0 ? rule.message : null;
            
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
            
        case "numeric": {
            const numericRegex = /^\d*$/;
            return !numericRegex.test(value) ? rule.message : null;
        }
            
        default:
            return null;
    }
};

/**
 * Validates a single field value against its validation rules
 */
export const validateField = (
    value: T_AnswersMapValue,
    config: T_FieldValidationConfig
): T_ValidationResult => {
    const { rules } = config;
    
    // Convert value to string for validation
    const stringValue = Array.isArray(value) 
        ? value.join(',') 
        : String(value || '').trim();
    
    // Check each rule in order of priority
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

/**
 * Creates validation configuration from backend error messages
 */
export const createValidationConfig = (
    errorMessages?: Array<{ error: T_ErrorType; message: string }>,
    additionalRules?: T_ValidationRule[]
): T_FieldValidationConfig => {
    const rules: T_ValidationRule[] = [];
    
    // Add rules from backend error messages
    if (errorMessages) {
        errorMessages.forEach(errorMsg => {
            rules.push({
                type: errorMsg.error,
                value: getValidationValueFromErrorType(errorMsg.error),
                message: errorMsg.message
            });
        });
    }
    
    // Add any additional rules
    if (additionalRules) {
        rules.push(...additionalRules);
    }
    
    // Sort rules by priority (isRequired first, then others)
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

/**
 * Validates multiple fields at once (for form submission)
 */
export const validateForm = (
    formValues: Map<string, T_AnswersMapValue>,
    validationConfigs: Map<string, T_FieldValidationConfig>
): T_FormValidationResult => {
    const errors: T_ValidationErrors = new Map();
    let firstErrorField: string | undefined;
    
    // Validate each field that has configuration
    validationConfigs.forEach((config, fieldName) => {
        const value = formValues.get(fieldName);
        const result = validateField(value, config);
        
        if (!result.isValid && result.error) {
            errors.set(fieldName, result.error);
            if (!firstErrorField) {
                firstErrorField = fieldName;
            }
        }
    });
    
    return {
        isValid: errors.size === 0,
        errors,
        firstErrorField
    };
};

/**
 * Helper to normalize backend error messages structure
 */
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
    
    // If it's already in the correct format
    if (Array.isArray(errorMessages)) {
        return errorMessages;
    }
    
    // If it's in the nested format, extract the attributes
    if ('data' in errorMessages && Array.isArray(errorMessages.data)) {
        return errorMessages.data.map(item => ({
            error: item.attributes.error,
            message: item.attributes.message
        }));
    }
    
    return [];
};