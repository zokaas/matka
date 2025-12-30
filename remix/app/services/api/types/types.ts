import { SessionData } from "react-router";

export type T_CompanyDataFromSession = {
    sessionId: string;
    organizationName: string;
    organizationNumber: string;
    sniCode: string;
};

export type T_RefreshSessionResponse = {
    sessionId: string;
    exp: number;
    sessionRefreshCount: number;
};

export type T_CacheUserAuthData = {
    given_name: string;
    family_name: string;
    ssn: string;
    iat: number;
};

export type T_CacheCompanyData = {
    orgNumber: string;
    companyName: string;
    sniCode: string;
};

export type T_CacheSessionData = {
    sessionId: string;
    exp: number;
    sessionRefreshCount: number;
    maxSessionRefresh: number;
    kcUserId: string;
};

export type T_SessionData = SessionData & {
    applicationId: string | null;
    applicationUuid: string;
    clientId: string;
    kycType: string;
    kycDoneUrl: string;
    loginUrl: string;
    session: T_CacheSessionData;
    company: T_CacheCompanyData;
    auth: T_CacheUserAuthData;
};

export type T_BffSessionPostResponse = {
    redisKey?: string;
};

export type T_BffSessionGetResponse = T_SessionData & T_BffSessionPostResponse;
