import { T_ProductIdPageData } from "~/routes/types";
import { T_ParsedFormData } from "~/types";

export type T_FormPageProps = {
    generalData: T_ProductIdPageData;
    formData: T_ParsedFormData;
};

export type T_StepInfo = {
    currentStepIndex: number;
    totalSteps: number;
};
