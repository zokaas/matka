import { T_BffSessionGetResponse, T_BffSessionPostResponse, T_SessionData } from "./types";
import { buildUrl } from "../utils/urlHelpers.server";
import { deleteRequest, getRequest, postRequest } from "../utils/apiHelpers.server";

const cacheSessionServicePath = "cache/session";
export async function bffPost(
    body: T_SessionData,
    id: string = ""
): Promise<T_BffSessionPostResponse | null> {
    const url = buildUrl(cacheSessionServicePath, id);
    return postRequest(url, id, body);
}

export async function bffGet(id: string): Promise<T_BffSessionGetResponse | null> {
    const url = buildUrl(cacheSessionServicePath, id);
    try {
        return await getRequest<T_BffSessionGetResponse>(url, id);
    } catch (error) {
        console.error("Failed to get session data from bff redis", error);
        return null;
    }
}

export async function bffDelete(id: string): Promise<void> {
    const url = buildUrl(cacheSessionServicePath, id);
    try {
        await deleteRequest(url, id);
    } catch (error) {
        console.error("Failed to delete session data from bff redis", error);
    }
}
