export type T_VerifySessionResponseData = {
    status: boolean;
    ttl: number;
};

export type T_AuthSessionApiResponse<T = unknown> = {
    status: number;
    data: T;
};

export type T_BffSessionData = {
    userInfo: T_UserInfo;
    exp: number;
    sessionRefreshCount: number;
    maxSessionRefresh: number;
};

export type T_UserInfo = {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    user_roles: string[];
    given_name: string;
    family_name: string;
    attrs: T_UserAttributes;
};

export type T_UserAttributes = {
    bank?: string;
    firstname?: string;
    lastname?: string;
    fullname?: string;
    birthdate?: string;
    refType: string;
    ssn?: string;
    ref?: string;
};

export type T_DataToStore = {
    [key: string]: string | number | null;
};

export type T_SessionContext = {
    sessionId: string;
    productId: string;
    exp: number;
    maxSessionRefresh: number;
    sessionRefreshCount: number;
    applicationId: string;
};
