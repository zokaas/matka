/**
 * Core answer value type - supports all form input types
 */
export type T_AnswerValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | Record<string, string>[]
  | ""
  | undefined;

/**
 * Dropdown component value type (from UI library)
 */
export type T_DropDownOptionValue = string | number | string[];

/**
 * Utility type to normalize dropdown values to internal answer values
 * Handles all possible form input types
 */
export function normalizeDropdownValue(value: T_AnswerValue): T_AnswerValue {
  // Handle undefined/empty
  if (value === undefined || value === null) {
    return "";
  }
  
  // Handle arrays (string[] or object arrays)
  if (Array.isArray(value)) {
    return value;
  }
  
  // Handle primitives (string, number, boolean)
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  
  // Default fallback
  return value;
}

/**
 * Answer object stored in the form values Map
 */
export type T_AnswerObject = {
  questionId: string;
  question: string;
  answer: T_AnswerValue;
};

/**
 * Form values state - Map of field names to answer objects
 */
export type T_Answers = Map<string, T_AnswerObject>;