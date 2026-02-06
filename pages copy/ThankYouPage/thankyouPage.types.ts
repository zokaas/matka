import { T_PostApplicationResponse } from "../../api/types";
import { flowStatus, T_FlowStatus } from "../../types";

export type BaseThankYouState = {
    status: Exclude<T_FlowStatus, typeof flowStatus.ONBOARDING>;
};

export type OnboardingThankYouState = {
    status: typeof flowStatus.ONBOARDING;
    pipelineApplication: T_PostApplicationResponse;
};

export type ThankYouState = BaseThankYouState | OnboardingThankYouState;
