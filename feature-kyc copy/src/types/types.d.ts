export type ApplicationChannel = "BROKER" | "WEB" | "PHONE" | "LETTER";
export type ApplicationState = "PENDING" | "PN_CREATED" | "PN_SENT" | "APPROVED" | "REJECTED";
export interface KycData {
    kycDone: boolean;
    kycUpdatedDate: string | undefined;
    hasKyc: boolean;
    redirectUrl?: string;
    riskScore?: string;
    riskClassification?: string;
    industryCode?: string;
}
export interface KycDeadlineInfo {
    deadlineDate: Date;
    isPastDeadline: boolean;
    daysRemaining: number;
}
export type KycReducerState = {
    showModal: boolean;
    deadlineInfo?: KycDeadlineInfo;
};
export type T_ResponseError = {
    message: string;
};
export type FeatureKycState = {
    kyc: KycReducerState;
};
