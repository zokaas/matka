import { useState, useCallback, useMemo } from "react";
import { T_AnswersMapValue, T_ParsedFormData } from "~/types";
import { 
    T_ValidationErrors, 
    T_FieldValidationConfig,
    T_FormValidationResult 
} from "~/types/validation";
import { 
    validateField, 
    createValidationConfig,
    normalizeErrorMessages 
} from "~/utils/validation";

export const useFormValidation = (formData: T_ParsedFormData) => {
    const [validationErrors, setValidationErrors] = useState<T_ValidationErrors>(new Map());
    
    const validationConfigs = useMemo(() => {
        const configs = new Map<string, T_FieldValidationConfig>();
        
        formData.steps.forEach((questions) => {
            questions.forEach((question) => {
                const { questionParameter, errorMessages } = question.question;
                
                const normalizedErrors = normalizeErrorMessages(errorMessages);
                const config = createValidationConfig(normalizedErrors);
                configs.set(questionParameter, config);
                
                if (question.question.dependentQuestion) {
                    const depQuestion = question.question.dependentQuestion;
                    const depNormalizedErrors = normalizeErrorMessages(depQuestion.errorMessages);
                    const depConfig = createValidationConfig(depNormalizedErrors);
                    const depFieldName = `${questionParameter}::${depQuestion.questionParameter}`;
                    configs.set(depFieldName, depConfig);
                }
            });
        });
        
        return configs;
    }, [formData]);
    
    const validateSingleField = useCallback((
        fieldName: string, 
        value: T_AnswersMapValue,
        updateState = true
    ): boolean => {
        const config = validationConfigs.get(fieldName);
        if (!config) return true;
        
        const result = validateField(value, config);
        
        if (updateState) {
            setValidationErrors(prev => {
                const newErrors = new Map(prev);
                if (result.error) {
                    newErrors.set(fieldName, result.error);
                } else {
                    newErrors.delete(fieldName);
                }
                return newErrors;
            });
        }
        
        return result.isValid;
    }, [validationConfigs]);
    

    const validateEntireForm = useCallback((
        formValues: Map<string, T_AnswersMapValue>
    ): T_FormValidationResult => {
        const errors: T_ValidationErrors = new Map();
        let firstErrorField: string | undefined;
        

        const visibleFields = new Set<string>();
        
        formData.steps.forEach((questions) => {
            questions.forEach((question) => {
                const { questionParameter } = question.question;
                visibleFields.add(questionParameter);
                
                // Check if dependent question should be visible
                if (question.question.dependentQuestion) {
                    const depQuestion = question.question.dependentQuestion;
                    const parentValue = formValues.get(questionParameter);
                    const shouldShow = String(depQuestion.conditionValue) === String(parentValue);
                    
                    if (shouldShow) {
                        const depFieldName = `${questionParameter}::${depQuestion.questionParameter}`;
                        visibleFields.add(depFieldName);
                    }
                }
            });
        });
        
        validationConfigs.forEach((config, fieldName) => {
            if (visibleFields.has(fieldName)) {
                const value = formValues.get(fieldName);
                const result = validateField(value, config);
                
                if (!result.isValid && result.error) {
                    errors.set(fieldName, result.error);
                    if (!firstErrorField) {
                        firstErrorField = fieldName;
                    }
                }
            }
        });
        
        setValidationErrors(errors);
        
        return {
            isValid: errors.size === 0,
            errors,
            firstErrorField
        };
    }, [validationConfigs, formData, validateField]);

    const clearFieldError = useCallback((fieldName: string) => {
        setValidationErrors(prev => {
            const newErrors = new Map(prev);
            newErrors.delete(fieldName);
            return newErrors;
        });
    }, []);
    

    const clearAllErrors = useCallback(() => {
        setValidationErrors(new Map());
    }, []);
    

    const getFieldError = useCallback((fieldName: string): string | undefined => {
        return validationErrors.get(fieldName);
    }, [validationErrors]);
    

    const hasFieldError = useCallback((fieldName: string): boolean => {
        return validationErrors.has(fieldName);
    }, [validationErrors]);
    
    const errorCount = useMemo(() => validationErrors.size, [validationErrors]);
    
    
    return {
        // State
        validationErrors,
        errorCount,
        
        // Validation functions
        validateSingleField,
        validateEntireForm,
        
        // Error management
        clearFieldError,
        clearAllErrors,
        getFieldError,
        hasFieldError,
        
        // Validation configs (for debugging)
        validationConfigs
    };
};