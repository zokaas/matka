import { createAction, ActionType } from "typesafe-actions";
import { KycActionConstants, KycPayload } from "../types/kyc";

export const kycActions = {
    kycTrigger: createAction(KycActionConstants.KYC_TRIGGER)<KycPayload>(),
};

export type KycAction = ActionType<typeof kycActions>;
