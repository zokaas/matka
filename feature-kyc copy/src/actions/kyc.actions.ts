import { createAction, ActionType } from "typesafe-actions";
import {
    E_KycActionConstants,
    T_KycCreditSafeReportPayload,
    T_KycInitializerPayload,
    T_KycPayload,
    T_KycState,
    T_KycStartFlowPayload,
} from "../types";

export const kycActions = {
    kycInitializer: createAction(E_KycActionConstants.KYC_INITIALIZEER)<T_KycInitializerPayload>(),
    kycFetchCreditSafeReportTrigger: createAction(
        E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_TRIGGER
    )<T_KycPayload>(),
    kycFetchCreditSafeReportSuccess: createAction(
        E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_SUCCESS
    )<T_KycCreditSafeReportPayload>(),
    updateKycState: createAction(E_KycActionConstants.UPDATE_KYC_STATE)<T_KycState>(),
    showModal: createAction(E_KycActionConstants.KYC_SHOW_MODAL)(),
    hideModal: createAction(E_KycActionConstants.KYC_HIDE_MODAL)(),
    kycStartFlowTrigger: createAction(
        E_KycActionConstants.KYC_START_FLOW_TRIGGER
    )<T_KycStartFlowPayload>(),
    kycStartFlowSuccess: createAction(E_KycActionConstants.KYC_START_FLOW_SUCCESS)(),
};

export type T_KycAction = ActionType<typeof kycActions>;