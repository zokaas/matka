import { createAction, ActionType } from "typesafe-actions";
import {
    E_KycActionConstants,
    T_KycInitializerPayload,
    T_KycState,
    T_KycStartFlowPayload,
    T_KycReducerState,
} from "../types";

export const kycActions = {
    kycInitializer: createAction(E_KycActionConstants.KYC_INITIALIZEER)<T_KycInitializerPayload>(),
    updateKycState: createAction(E_KycActionConstants.UPDATE_KYC_STATE)<T_KycState>(),
    updateReturnedFromKycState: createAction(
        E_KycActionConstants.RETURNED_FROM_KYC
    )<T_KycReducerState>(),
    showModal: createAction(E_KycActionConstants.KYC_SHOW_MODAL)(),
    hideModal: createAction(E_KycActionConstants.KYC_HIDE_MODAL)(),
    kycStartFlowTrigger: createAction(
        E_KycActionConstants.KYC_START_FLOW_TRIGGER
    )<T_KycStartFlowPayload>(),
    kycStartFlowSuccess: createAction(E_KycActionConstants.KYC_START_FLOW_SUCCESS)(),
};

export type T_KycAction = ActionType<typeof kycActions>;
