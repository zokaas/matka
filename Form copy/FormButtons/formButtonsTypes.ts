import { T_Step } from "@ui-components/index";

export type T_FormButtons = {
    currentStepIndex: number;
    steps: T_Step[];
    onNext: () => void;
    onBack: () => void;
};
