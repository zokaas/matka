import { DefaultInitializerType } from "@opr-finance/utils";

export enum E_KycActionConstants {
    KYC_INITIALIZEER = "KYC_INITIALIZEER",
    UPDATE_KYC_STATE = "UPDATE_KYC_STATE",
    RETURNED_FROM_KYC = "RETURNED_FROM_KYC",
    KYC_SHOW_MODAL = "KYC/SHOW_MODAL",
    KYC_HIDE_MODAL = "KYC/HIDE_MODAL",
    KYC_START_FLOW_TRIGGER = "KYC/START_FLOW_TRIGGER",
    KYC_START_FLOW_SUCCESS = "KYC/START_FLOW_SUCCESS",
}

export type T_Config = {
    token: string | null;
    bffUrl: string;
    mock: boolean;
    cid: string;
};

export type T_KycPayload = {
    applicationId: string;
    smeId: string;
    companyId: string;
};
export type T_KycInitializerPayload = {
    bffUrl: string;
    token: string;
    mock: boolean;
    cid: string;
};

export type T_KycReducerState = {
    kycStatus: T_KycState;
    config: T_Config;
    showModal: boolean;
    isLoading: boolean;
    returnedFromKyc: boolean;
};

export type T_KycState = {
    kycDone: boolean;
    kycUpdatedDate: string;
    kycDueDate: string;
};

export type T_FeatureKycState = {
    kyc: T_KycReducerState;
};

export type T_CountryProductId = "finland-flex-online" | "sweden-flex-online";

export type T_CreditSafeRequest = T_KycPayload &
    DefaultInitializerType & { cid: T_CountryProductId };

export type T_KycStartFlowPayload = {
    applicationId: string;
    smeId: string;
    companyId: string;
    flow: T_KycFlow;
};

export const kycFlow = {
    NEW_CUSTOMER: "new_customer",
    EXISTING_CUSTOMER: "existing_customer",
} as const;

export type T_KycFlow = (typeof kycFlow)[keyof typeof kycFlow];
