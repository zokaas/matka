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
