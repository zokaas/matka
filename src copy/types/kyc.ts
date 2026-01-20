import { T_LoginSessionReducerState } from "@opr-finance/feature-login-session";
import { T_CompanyApiResponse } from "@opr-finance/feature-sme-customer/src/types";

export const kycFlow = {
    NEW_CUSTOMER: "new_customer",
    EXISTING_CUSTOMER: "existing_customer",
} as const;

export type T_KycFlow = (typeof kycFlow)[keyof typeof kycFlow];

export const kycRedirectPath: Record<T_KycFlow, string> = {
    [kycFlow.NEW_CUSTOMER]: "thank-you",
    [kycFlow.EXISTING_CUSTOMER]: "front",
};

export const kycType = {
    ONBOARDING: "onboarding",
    UPDATING: "updating",
} as const;

export type T_KycType = (typeof kycType)[keyof typeof kycType];

export type T_KycParams = {
    applicationId: string;
    clientId: string;
    kycType: T_KycType;
    kycFlow: T_KycFlow;
    company: T_CompanyKycParams;
    session: T_SessionKycParams;
    auth: T_UserAuthInfo;
};

export type T_UserAuthInfo = {
    given_name: string;
    family_name: string;
    ssn: string;
    iat: number;
};

export type T_LoginSessionDataForKyc = {
    exp: number;
    sessionRefreshCount: number;
    maxSessionRefresh: number;
    kcUserId: string;
    auth: T_UserAuthInfo;
};

export type T_CompanyDataForKyc = {
    organizationNumber: string;
    name: string;
    sniCode: string;
};

export type T_CompanyKycParams = {
    orgNumber: string;
    companyName: string;
    sniCode: string;
};

type T_SessionKycParams = {
    sessionId: string;
    exp: number;
    sessionRefreshCount: number;
    maxSessionRefresh: number;
    kcUserId: string;
};

export type T_KycState = {
    kycDone: boolean;
    kycUpdatedDate: string;
    kycDueDate: string;
};

export type T_KycReducerState = {
    kyc: T_KycState;
};

export type T_HandleStartKycParams = {
    company: T_CompanyApiResponse | undefined;
    session: T_LoginSessionReducerState;
    flow: T_KycFlow;
    applicationId: string;
};
