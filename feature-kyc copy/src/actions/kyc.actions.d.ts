import { ActionType } from "typesafe-actions";
import { E_KycActionConstants, T_KycCreditSafeReportPayload, T_KycInitializerPayload, T_KycPayload, T_KycState } from "../types";
export declare const kycActions: {
    kycInitializer: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.KYC_INITIALIZEER, T_KycInitializerPayload>;
    kycFetchCreditSafeReportTrigger: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_TRIGGER, T_KycPayload>;
    kycFetchCreditSafeReportSuccess: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_SUCCESS, T_KycCreditSafeReportPayload>;
    updateKycState: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.UPDATE_KYC_STATE, T_KycState>;
};
export type T_KycAction = ActionType<typeof kycActions>;
