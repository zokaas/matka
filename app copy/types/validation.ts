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
    value?: string | number;
    message: string;
};

export type T_ValidationErrors = Map<string, string>;

export type T_FieldValidationConfig = {
    rules: T_ValidationRule[];
    isRequired?: boolean;
};

export type T_ValidationResult = {
    isValid: boolean;
    error?: string;
};

export type T_FormValidationResult = {
    isValid: boolean;
    errors: T_ValidationErrors;
    firstErrorField?: string;
};