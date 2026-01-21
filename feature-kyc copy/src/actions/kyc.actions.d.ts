import { ActionType } from "typesafe-actions";
import { E_KycActionConstants, T_KycInitializerPayload, T_KycState, T_KycStartFlowPayload, T_KycReducerState } from "../types";
export declare const kycActions: {
    kycInitializer: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.KYC_INITIALIZEER, T_KycInitializerPayload>;
    updateKycState: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.UPDATE_KYC_STATE, T_KycState>;
    updateReturnedFromKycState: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.RETURNED_FROM_KYC, T_KycReducerState>;
    showModal: import("typesafe-actions").EmptyActionCreator<E_KycActionConstants.KYC_SHOW_MODAL>;
    hideModal: import("typesafe-actions").EmptyActionCreator<E_KycActionConstants.KYC_HIDE_MODAL>;
    kycStartFlowTrigger: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.KYC_START_FLOW_TRIGGER, T_KycStartFlowPayload>;
    kycStartFlowSuccess: import("typesafe-actions").EmptyActionCreator<E_KycActionConstants.KYC_START_FLOW_SUCCESS>;
};
export type T_KycAction = ActionType<typeof kycActions>;
