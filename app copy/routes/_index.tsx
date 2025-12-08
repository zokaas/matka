import { LoaderFunction, redirect } from "react-router";
import { T_BffSessionGetResponse, T_SessionData } from "~/services";
import { bffGet } from "~/services/api/api-cahe.server";
import {
    buildDestroySessionHeader,
    getSession as getCachedSession,
    commitSession,
} from "~/services/session/cacheSession.server";
import { verifyBffSession } from "~/services/session/sessionProvider.server";
import { computeMaxAgeFromExp } from "~/utils/expiryUtils.server";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    // get redis key from Url and fetch cached data
    const { key } = searchParams;
    const cachedData: T_BffSessionGetResponse | null = await bffGet(key);
    if (!cachedData) {
        throw new Response("Invalid or expired session", {
            status: 401,
            statusText: "Unauthorized",
        });
    }
    console.log("cachedData", cachedData);

    const { clientId, kycType } = cachedData;
    const { sessionId, exp } = cachedData.session;

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
    const session = await getCachedSession(request.headers.get("cookie"));
    const sessionValues: T_SessionData = {
        ...cachedData,
        kycDoneUrl: "",
        loginUrl: "",
    };

    Object.entries(sessionValues).forEach(([k, v]) => {
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
