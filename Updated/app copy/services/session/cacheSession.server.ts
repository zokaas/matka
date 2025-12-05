import { createCookie, createSessionStorage } from "react-router";
import { buildUrl } from "../utils/urlHelpers.server";
import { deleteRequest, getRequest, postRequest } from "../utils/apiHelpers.server";
import type {
    T_BffSessionGetResponse,
    T_BffSessionPostResponse,
    T_CompanyDataFromSession,
    T_SessionData,
} from "../api";
import { appConfig } from "~/config";

const cacheSessionServicePath = "cache/session";
// ----- cookie used to store the session id on the client -----
const { sessionSecret } = appConfig;

const sessionCookie = createCookie("opr_kyc", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    // maxAge is initially set for 60 sec, then it will be set per request when committing the session (calculated from sessionInfo.exp)
    maxAge: 60,
});

// ---- BFF API Calls ----
async function bffPost(
    body: T_SessionData,
    id: string = ""
): Promise<T_BffSessionPostResponse | null> {
    const url = buildUrl(cacheSessionServicePath, id);
    return postRequest(url, id, body);
}

async function bffGet(id: string): Promise<T_BffSessionGetResponse | null> {
    const url = buildUrl(cacheSessionServicePath, id);
    try {
        return await getRequest<T_BffSessionGetResponse>(url, id);
    } catch (error) {
        console.error("Failed to get session data from bff redis", error);
        return null;
    }
}

async function bffDelete(id: string): Promise<void> {
    const url = buildUrl(cacheSessionServicePath, id);
    try {
        await deleteRequest(url, id);
    } catch (error) {
        console.error("Failed to delete session data from bff redis", error);
    }
}

// ---- Custom Session Storage ----
function sessionStorage() {
    return createSessionStorage<T_SessionData>({
        cookie: sessionCookie,
        // createData: called when there's no session id cookie (create new session in redis)
        createData: async (data: Partial<T_SessionData>): Promise<string> => {
            const payload: T_SessionData = {
                exp: data.exp,
                sessionId: data.sessionId!,
                clientId: data.clientId!,
                applicationId: data.applicationId ?? "",
                kcUserId: data.kcUserId ?? "",
                sessionRefreshCount: data.sessionRefreshCount ?? 0,
                maxSessionRefresh: data.maxSessionRefresh ?? 1,
                companyName: data.companyName ?? "",
                orgNumber: data.orgNumber ?? "",
                loginUrl: data.loginUrl ?? "",
                kycDoneUrl: data.kycDoneUrl ?? "",
            };

            const res = await bffPost(payload);
            console.log("session CREATED", res);
            const newId = res?.redisKey ?? "";
            return newId;
        },

        async readData(id: string): Promise<T_SessionData | null> {
            if (!id) return null;

            const res = await bffGet(id);
            console.log("Session FETCHED");

            return res ? { ...res } : null;
        },

        async updateData(id: string, data: Partial<T_SessionData>): Promise<void> {
            const payload: T_SessionData = {
                ...(data as T_SessionData),
            };
            await bffPost(payload, id);
            console.log("Session UPDATED");
        },

        async deleteData(id: string): Promise<void> {
            await bffDelete(id);
            console.log("Session DELETED");
        },
    });
}
export const { getSession, commitSession, destroySession } = sessionStorage();

export const getOrganizationFromSession = async (
    request: Request
): Promise<T_CompanyDataFromSession> => {
    const session = await getSession(request.headers.get("Cookie"));

    const sessionId = session.get("sessionId");
    const organizationName = session.get("companyName") ?? "";
    const organizationNumber = session.get("orgNumber") ?? "";

    return {
        sessionId: sessionId ?? "",
        organizationName,
        organizationNumber,
    };
};

export const getSessionProps = async <K extends keyof T_SessionData>(
    request: Request,
    ...keys: K[]
): Promise<Pick<T_SessionData, K>> => {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);

    const data = session.data as T_SessionData;

    const result = {} as Pick<T_SessionData, K>;
    for (const key of keys) {
        result[key] = data[key];
    }

    return result;
};

export async function buildDestroySessionHeader(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const setCookie = await destroySession(session);
    return { "Set-Cookie": setCookie };
}
