import { T_BasicCompany } from "./application";

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

export type T_CompanyDataForKyc = Pick<
    T_BasicCompany,
    "organizationNumber" | "name" | "sni" | "sni_text"
>;

type T_CompanyKycParams = {
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
