import { LoaderFunction, redirect } from "react-router";
import { appConfig } from "~/config";
import { T_BffSessionGetResponse } from "~/services";
import { bffGet } from "~/services/api/api-cache.server";
import {
    buildDestroySessionHeader,
    getSession as getCachedSession,
    commitSession,
    sessionCookie,
} from "~/services/session/cacheSession.server";
import { verifyBffSession } from "~/services/session/sessionProvider.server";
import { computeMaxAgeFromExp } from "~/utils/expiryUtils.server";
import { getTestData } from "../../.mock/mockSessionData";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    let cachedData: T_BffSessionGetResponse | null = null;
    let redisKey = "";
    const { testMode } = appConfig;
    if (testMode === 1) {
        const expires = (Math.floor(Date.now() / 1000) + 5 * 60) * 1000;

        const { appid, uuid, id } = searchParams;
        console.log(`Test Mode with appId: ${appid}, appUuid: ${uuid} and sessonId ${id}`);
        cachedData = getTestData(appid, uuid, id, expires);
        redisKey = id;
    } else {
        // get redis key from Url and fetch cached data
        const { key } = searchParams;
        redisKey = key;
        cachedData = await bffGet(key);
    }

    console.log("cachedData", cachedData);

    if (!cachedData) {
        throw new Response("Invalid or expired session", {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const { clientId, kycType } = cachedData;
    const { sessionId, exp } = cachedData.session;

    if (!clientId || !kycType) {
        throw new Response("Missin clientId or kycType in session data", {
            status: 400,
            statusText: "Bad Request",
        });
    }
    const { status, ttl } = await verifyBffSession(clientId, sessionId);
    if (!status || !ttl) {
        const headers = await buildDestroySessionHeader(request);
        throw new Response("Invalid or expired session", {
            status: 401,
            statusText: "Unauthorized",
            headers,
        });
    }

    // create a session object and commit via SessionStorage
    console.log("start cache-session FLOW");
    const maxAge = computeMaxAgeFromExp(exp ? exp / 1000 : Date.now() / 1000);
    // Create signed cookie with redis key
    const cookieFromKey = await sessionCookie.serialize(redisKey);
    const session = await getCachedSession(cookieFromKey);
    Object.entries(cachedData).forEach(([k, v]) => {
        if (v !== undefined) session.set(k, v);
    });

    // commitSession will call createData/updateData under the hood (which will call BFF endpoints).
    const cookieHeader = await commitSession(session, { maxAge }); // store session

    return redirect(`/${clientId}/${kycType}`, {
        headers: {
            "Set-Cookie": cookieHeader,
        },
    });
};

export default function Index() {
    return null;
}
