import { createCookie, createSessionStorage } from "react-router";
import type { T_CompanyDataFromSession, T_SessionData } from "../api";
import { appConfig } from "~/config";
import { bffDelete, bffGet, bffPost } from "../api/api-cache.server";

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

// ---- Custom Session Storage ----
function sessionStorage() {
    return createSessionStorage<T_SessionData>({
        cookie: sessionCookie,
        // createData: called when there's no session id cookie (create new session in redis)
        createData: async (data: Partial<T_SessionData>): Promise<string> => {
            const payload: T_SessionData = {
                applicationId: data.applicationId ?? null,
                applicationUuid: data.applicationUuid ?? "",
                clientId: data.clientId ?? "",
                kycType: data.kycType ?? "",
                loginUrl: data.loginUrl ?? "",
                kycDoneUrl: data.kycDoneUrl ?? "",
                company: data.company ?? {
                    orgNumber: "",
                    companyName: "",
                    sniCode: "",
                },
                session: data.session ?? {
                    sessionId: "",
                    exp: 0,
                    sessionRefreshCount: 0,
                    maxSessionRefresh: 0,
                    kcUserId: "",
                },
                auth: data.auth ?? {
                    given_name: "",
                    family_name: "",
                    ssn: "",
                    iat: 0,
                },
            };

            const res = await bffPost(payload);
            console.log("session CREATED", res);
            const newId = res?.redisKey ?? "";
            return newId;
        },

        async readData(id: string): Promise<T_SessionData | null> {
            console.log("readData", id);
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

    const sessionId = session.get("session")?.sessionId;
    const organizationName = session.get("company")?.companyName ?? "";
    const organizationNumber = session.get("company")?.orgNumber ?? "";
    const sniCode = session.get("company")?.sniCode ?? "";

    return {
        sessionId: sessionId ?? "",
        organizationName,
        organizationNumber,
        sniCode: sniCode,
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
