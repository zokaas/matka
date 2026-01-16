import { createAction } from "typesafe-actions";
import { T_ResponseError } from "../types/types";

export enum E_KycActionConstants {
    SHOW_MODAL = "FEATURE/KYC/SHOW_MODAL",
    HIDE_MODAL = "FEATURE/KYC/HIDE_MODAL",
    VALIDATION_START = "FEATURE/KYC/VALIDATION_START",
    VALIDATION_SUCCESS = "FEATURE/KYC/VALIDATION_SUCCESS",
    VALIDATION_FAILED = "FEATURE/KYC/VALIDATION_FAILED",
}

export const kycActions = {
    showModal: createAction(E_KycActionConstants.SHOW_MODAL)(),
    hideModal: createAction(E_KycActionConstants.HIDE_MODAL)(),
    validationStart: createAction(E_KycActionConstants.VALIDATION_START)(),
    validationSuccess: createAction(E_KycActionConstants.VALIDATION_SUCCESS)(),
    validationFailed: createAction(E_KycActionConstants.VALIDATION_FAILED)<T_ResponseError>(),
};

export type KycAction = ReturnType<(typeof kycActions)[keyof typeof kycActions]>;