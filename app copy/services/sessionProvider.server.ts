import {
    T_AuthSessionApiResponse,
    T_VerifySessionResponseData,
    T_SessionData,
} from "~/types/session";
import { getRequest } from "./utils/apiHelpers.server";
import { buildUrl } from "./utils/urlHelpers.server";

export const verifySession = async (
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

export const endSession = async (
    sessionId: string,
    clientId: string
): Promise<T_AuthSessionApiResponse | null> => {
    const logoutPath = "authenticate/logout";
    const url = buildUrl(logoutPath, clientId);

    return getRequest<T_AuthSessionApiResponse>(url, sessionId);
};

export const getSession = async (
    sessionId: string,
    clientId: string
): Promise<T_SessionData | null> => {
    const sessionInfoPath = "authenticate/sessioninfo";
    const url = buildUrl(sessionInfoPath, clientId);

    try {
        return await getRequest<T_SessionData>(url, sessionId);
    } catch (error) {
        console.error("Failed to get session data from bff", error);
        return null;
    }
};
