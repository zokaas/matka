import { getEnv } from "~/environment";
import { getRequest } from "../utils/apiHelpers.server";
import { T_RefreshSessionResponse } from "./types";

const getSessionRefreshUrl = (clientId: string) => {
    const bffBaseUrl: string = getEnv(process.env).BFF_BASE_URL;
    return `${bffBaseUrl}/refresh/${clientId}`;
};

export const refreshSession = async (
    sessionId: string,
    clientId: string
): Promise<T_RefreshSessionResponse> => {
    const url = getSessionRefreshUrl(clientId);

    const response = await getRequest<T_RefreshSessionResponse>(url, sessionId);
    console.log("refresh response: ", response);
    return response;
};
