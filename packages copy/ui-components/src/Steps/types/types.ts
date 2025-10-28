export type T_StepProps = {
    state: "active" | "last" | "completed" | "inactive";
    currentStepIndex: number;
    index: number;
    label: string;
};

export type T_Step = { stepLabel: string; stepName: string };

export type T_Steps = {
    steps: Array<T_Step>;
    currentStepIndex: number;
};
