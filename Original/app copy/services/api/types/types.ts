import { SessionData } from "react-router";

export type T_CompanyDataFromSession = {
    sessionId: string;
    organizationName: string;
    organizationNumber: string;
};

export type T_RefreshSessionResponse = {
    sessionId: string;
    exp: number;
    sessionRefreshCount: number;
};

export type T_SessionData = SessionData & {
    sessionId: string;
    clientId: string;
    applicationId: string;
    kcUserId: string;
    exp?: number;
    sessionRefreshCount?: number;
    maxSessionRefresh?: number;
    companyName: string;
    orgNumber: string;
    loginUrl: string;
    kycDoneUrl: string;
};

export type T_BffSessionPostResponse = {
    redisKey?: string;
};

export type T_BffSessionGetResponse = T_SessionData & T_BffSessionPostResponse;
