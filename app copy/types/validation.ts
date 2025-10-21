// app/types/validation.ts
export type T_ErrorType = 
    | "isRequired" 
    | "maxLength500" 
    | "maxLength20" 
    | "maxLength100"
    | "maxLength1000"
    | "numeric";

export type T_ErrorMessage = {
    error: T_ErrorType;
    message: string;
};

export type T_ValidationRule = {
    type: T_ErrorType;
    value?: string | number; // calculated from error type in frontend
    message: string;
};

// For form validation state
export type T_ValidationErrors = Map<string, string>; // fieldName -> error message

// For field validation configuration
export type T_FieldValidationConfig = {
    rules: T_ValidationRule[];
    isRequired?: boolean;
};

// Validation result for a single field
export type T_ValidationResult = {
    isValid: boolean;
    error?: string; // Only the first/most important error
};

// Form validation result
export type T_FormValidationResult = {
    isValid: boolean;
    errors: T_ValidationErrors;
    firstErrorField?: string; // For focusing on first error
};