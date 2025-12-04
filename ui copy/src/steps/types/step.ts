import { T_StylesProps } from "./types";

export type T_StepProps = {
    label: string;
    key: string;
    currentStep: number;
    activeStep: number;
    styling?: T_StylesProps;
};
