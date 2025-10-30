import { T_StylesProps } from "./types";

export type T_StepsProps = {
    steps: Array<T_Step>;
    activeStep: number;
    styling?: T_StylesProps;
};

export type T_Step = { stepLabel: string; stepName: string };
