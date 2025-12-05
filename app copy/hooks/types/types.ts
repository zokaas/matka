export type T_RefreshResult = { exp: number; sessionRefreshCount: number } | null;

export type T_SessionLoaderData = {
    sessionRefreshCount: number;
    maxSessionRefresh: number;
    exp: number;
    sessionId?: string;
};
