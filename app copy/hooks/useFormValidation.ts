import { useState, useMemo } from "react";
import { T_AnswerValue, T_ParsedFormData } from "~/types";
import { 
    T_ValidationErrors, 
    T_FieldValidationConfig,
    T_FormValidationResult 
} from "~/types/validation";
import { 
    validateField, 
    createValidationConfig,
    isFieldVisible
} from "~/utils/validation";

export const useFormValidation = (formData: T_ParsedFormData) => {
    const [validationErrors, setValidationErrors] = useState<T_ValidationErrors>(new Map());
    
    const validationConfigs = useMemo(() => {
        const configs = new Map<string, T_FieldValidationConfig>();
        
        formData.steps.forEach((questions) => {
            questions.forEach((question) => {
                const { questionParameter, errorMessages } = question.question;
                
                const config = createValidationConfig(errorMessages);
                configs.set(questionParameter, config);
                
                if (question.question.dependentQuestion) {
                    const depQuestion = question.question.dependentQuestion;
                    const depConfig = createValidationConfig(depQuestion.errorMessages);
                    configs.set(depQuestion.questionParameter, depConfig);
                }
            });
        });
        
        return configs;
    }, [formData.steps]);
    
    const validateSingleField = (
        fieldName: string, 
        value: T_AnswerValue,
        updateState = true
    ): boolean => {
        const config = validationConfigs.get(fieldName);
        if (!config) {
            console.warn(`⚠️ No validation config found for field: ${fieldName}`);
            return true;
        }
        
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
    };
    
    const validateEntireForm = (
        formValues: Map<string, T_AnswerValue>
    ): T_FormValidationResult => {
        const errors: T_ValidationErrors = new Map();
        let firstErrorField: string | undefined;
        
        validationConfigs.forEach((config, fieldName) => {
            const visible = isFieldVisible(fieldName, formData, formValues);
            
            if (visible) {
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
    };

    const clearFieldError = (fieldName: string) => {
        setValidationErrors(prev => {
            const newErrors = new Map(prev);
            newErrors.delete(fieldName);
            return newErrors;
        });
    };
    
    const isVisible = (
        fieldName: string, 
        formValues: Map<string, T_AnswerValue>
    ): boolean => {
        return isFieldVisible(fieldName, formData, formValues);
    };
    
    return {
        validationErrors,
        validateSingleField,
        validateEntireForm,
        clearFieldError,
        isVisible,
    };
};