import {
    T_AuthSessionApiResponse,
    T_VerifySessionResponseData,
    T_BffSessionData as T_BffSessionData,
} from "~/types/session";
import { buildUrl } from "../utils/urlHelpers.server";
import { getRequest } from "../utils/apiHelpers.server";
import { T_RefreshSessionResponse } from "../api";

export const verifyBffSession = async (
    clientId: string,
    sessionId: string
): Promise<T_VerifySessionResponseData> => {
    const verifyPath = "authenticate/verify";
    const url = buildUrl(verifyPath, clientId);
    try {
        const response = await getRequest<T_VerifySessionResponseData>(url, sessionId);
        return response;
    } catch (error) {
        console.error("Failed to verify session", error);
        return { status: false, ttl: 0 }; // Return null in case of an error
    }
};

export const endBffSession = async (
    sessionId: string,
    clientId: string
): Promise<T_AuthSessionApiResponse> => {
    const logoutPath = "authenticate/logout";
    const url = buildUrl(logoutPath, clientId);

    return getRequest<T_AuthSessionApiResponse>(url, sessionId);
};

export const getBffSession = async (
    sessionId: string,
    clientId: string
): Promise<T_BffSessionData | null> => {
    const sessionInfoPath = "authenticate/sessioninfo";
    const url = buildUrl(sessionInfoPath, clientId);

    try {
        return await getRequest<T_BffSessionData>(url, sessionId);
    } catch (error) {
        console.error("Failed to get session data from bff", error);
        return null;
    }
};

export const refreshBffSession = async (
    sessionId: string,
    clientId: string
): Promise<T_RefreshSessionResponse> => {
    const url = buildUrl("refresh", clientId);
    console.log("refreshSession", clientId, sessionId);
    const response = await getRequest<T_RefreshSessionResponse>(url, sessionId);
    console.log("refresh response: ", response);
    return response;
};
