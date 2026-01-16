import { T_ResponseError } from "../types/types";
export declare enum E_KycActionConstants {
    SHOW_MODAL = "FEATURE/KYC/SHOW_MODAL",
    HIDE_MODAL = "FEATURE/KYC/HIDE_MODAL",
    VALIDATION_START = "FEATURE/KYC/VALIDATION_START",
    VALIDATION_SUCCESS = "FEATURE/KYC/VALIDATION_SUCCESS",
    VALIDATION_FAILED = "FEATURE/KYC/VALIDATION_FAILED"
}
export declare const kycActions: {
    showModal: import("typesafe-actions").EmptyActionCreator<E_KycActionConstants.SHOW_MODAL>;
    hideModal: import("typesafe-actions").EmptyActionCreator<E_KycActionConstants.HIDE_MODAL>;
    validationStart: import("typesafe-actions").EmptyActionCreator<E_KycActionConstants.VALIDATION_START>;
    validationSuccess: import("typesafe-actions").EmptyActionCreator<E_KycActionConstants.VALIDATION_SUCCESS>;
    validationFailed: import("typesafe-actions").PayloadActionCreator<E_KycActionConstants.VALIDATION_FAILED, T_ResponseError>;
};
export type KycAction = ReturnType<(typeof kycActions)[keyof typeof kycActions]>;
