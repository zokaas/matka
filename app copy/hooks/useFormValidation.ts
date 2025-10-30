import { useState, useCallback, useMemo } from "react";
import { T_AnswerValue, T_ParsedFormData } from "~/types";
import { 
    T_ValidationErrors, 
    T_FieldValidationConfig,
    T_FormValidationResult 
} from "~/types/validation";
import { 
    validateField, 
    createValidationConfig,
    normalizeErrorMessages,
    isFieldVisible
} from "~/utils/validation";

export const useFormValidation = (formData: T_ParsedFormData) => {
    const [validationErrors, setValidationErrors] = useState<T_ValidationErrors>(new Map());
    
    // Build validation configurations from form data
    const validationConfigs = useMemo(() => {
        const configs = new Map<string, T_FieldValidationConfig>();
        
        formData.steps.forEach((questions) => {
            questions.forEach((question) => {
                const { questionParameter, errorMessages } = question.question;
                
                // Create config for main question
                const normalizedErrors = normalizeErrorMessages(errorMessages);
                const config = createValidationConfig(normalizedErrors);
                configs.set(questionParameter, config);
                
                // Create config for dependent question if it exists
                if (question.question.dependentQuestion) {
                    const depQuestion = question.question.dependentQuestion;
                    const depNormalizedErrors = normalizeErrorMessages(depQuestion.errorMessages);
                    const depConfig = createValidationConfig(depNormalizedErrors);
                    // ✅ The questionParameter on dependent question already includes the composite key
                    configs.set(depQuestion.questionParameter, depConfig);
                }
            });
        });
        
        return configs;
    }, [formData]);
    
    /**
     * Validate a single field
     * @param fieldName - The field to validate
     * @param value - The value to validate
     * @param updateState - Whether to update the validation errors state (default: true)
     * @returns boolean indicating if the field is valid
     */
    const validateSingleField = useCallback((
        fieldName: string, 
        value: T_AnswerValue,
        updateState = true
    ): boolean => {
        const config = validationConfigs.get(fieldName);
        if (!config) {
            console.warn(`⚠️ No validation config found for field: ${fieldName}`);
            return true;
        }
        
        console.log(`🔍 Validating field: ${fieldName}`, { value, config });
        
        const result = validateField(value, config);
        
        console.log(`✅ Validation result for ${fieldName}:`, result);
        
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
    
    /**
     * Validate the entire form
     * Only validates fields that should be visible based on current form state
     */
    const validateEntireForm = useCallback((
        formValues: Map<string, T_AnswerValue>
    ): T_FormValidationResult => {
        console.log("🔍 Starting full form validation...");
        
        const errors: T_ValidationErrors = new Map();
        let firstErrorField: string | undefined;
        
        // Validate each field that has a config and is visible
        validationConfigs.forEach((config, fieldName) => {
            // Check if field should be validated based on visibility
            const visible = isFieldVisible(fieldName, formData, formValues);
            
            console.log(`Field ${fieldName}: visible=${visible}`);
            
            if (visible) {
                const value = formValues.get(fieldName);
                console.log(`Validating ${fieldName} with value:`, value);
                
                const result = validateField(value, config);
                
                if (!result.isValid && result.error) {
                    console.log(`❌ ${fieldName} failed validation:`, result.error);
                    errors.set(fieldName, result.error);
                    if (!firstErrorField) {
                        firstErrorField = fieldName;
                    }
                } else {
                    console.log(`✅ ${fieldName} passed validation`);
                }
            } else {
                console.log(`⏭️ Skipping ${fieldName} (not visible)`);
            }
        });
        
        setValidationErrors(errors);
        
        console.log(`Form validation complete. Total errors: ${errors.size}`);
        
        return {
            isValid: errors.size === 0,
            errors,
            firstErrorField
        };
    }, [validationConfigs, formData]);

    /**
     * Clear error for a specific field
     */
    const clearFieldError = useCallback((fieldName: string) => {
        setValidationErrors(prev => {
            const newErrors = new Map(prev);
            newErrors.delete(fieldName);
            return newErrors;
        });
    }, []);
    
    /**
     * Clear all validation errors
     */
    const clearAllErrors = useCallback(() => {
        setValidationErrors(new Map());
    }, []);
    
    /**
     * Get error message for a specific field
     */
    const getFieldError = useCallback((fieldName: string): string | undefined => {
        return validationErrors.get(fieldName);
    }, [validationErrors]);
    
    /**
     * Check if a field has an error
     */
    const hasFieldError = useCallback((fieldName: string): boolean => {
        return validationErrors.has(fieldName);
    }, [validationErrors]);
    
    /**
     * Get count of current validation errors
     */
    const errorCount = useMemo(() => validationErrors.size, [validationErrors]);
    
    /**
     * Check if a specific field is currently visible
     */
    const isVisible = useCallback((
        fieldName: string, 
        formValues: Map<string, T_AnswerValue>
    ): boolean => {
        return isFieldVisible(fieldName, formData, formValues);
    }, [formData]);
    
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
        
        // Utility
        isVisible,
        
        // Validation configs (for debugging)
        validationConfigs
    };
};