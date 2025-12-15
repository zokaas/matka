import { T_Answers, T_AnswerValue, T_CountryArray, T_FormStepsWithQuestions } from "~/types";
import { T_ValidationErrors } from "~/types/validation";

export type T_QuestionsProps = {
    activeStep: number;
    activeStepName: string;
    questions: T_FormStepsWithQuestions;
    formValues: T_Answers;
    onChange: (fieldName: string, value: T_AnswerValue, displayText?: string) => void;
    onBlur: (fieldName: string) => void;
    countryList?: T_CountryArray;
    validationErrors: T_ValidationErrors;
};

export enum E_ComponentTypes {
    BENEFICIALOWNER = "BeneficialOwner",
    CHECKBOX = "Checkbox",
    MULTISELECT = "MultiSelectDropdown",
    NUMBER = "Number",
    RADIOGROUP = "RadioGroup",
    SELECT = "Select",
    TEXT = "Text",
    TEXTAREA = "Textarea",
}
