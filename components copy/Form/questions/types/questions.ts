import { T_DropDownOptionValue } from "@ui/dropdown";
import { T_Answers, T_CountryArray, T_FormStepsWithQuestions } from "~/types";

export type T_QuestionsProps = {
    activeStep: number;
    activeStepName: string;
    questions: T_FormStepsWithQuestions;
    formValues: T_Answers;
    onChange: (fieldName: string, value: T_DropDownOptionValue) => void;
    onBlur: (fieldName: string) => void;
    countryList?: T_CountryArray;
    // TODO: Remove any
    validationErrors: any;
};

export enum E_ComponentTypes {
    BENEFICIALOWNER = "BeneficialOwner",
    MULTISELECT = "MultiSelectDropdown",
    NUMBER = "Number",
    RADIOGROUP = "RadioGroup",
    SELECT = "Select",
    TEXT = "Text",
    TEXTAREA = "Textarea",
}
