import { T_ErrorView } from "apps/kyc/components/error";
import { T_ProductIdPageData } from "~/routes/types";
import { T_ParsedFormData } from "~/types";

export type T_FormPageProps = {
    generalData: T_ProductIdPageData;
    formData: T_ParsedFormData;
    error?: T_ErrorView;
};

export type T_StepInfo = {
    currentStepIndex: number;
    totalSteps: number;
};
