export type T_KycParams = {
    applicationId: string;
    clientId: string;
    kycType: "onboarding" | "updating";
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
};

export type T_KycReducerState = {
    kyc: T_KycState;
};
