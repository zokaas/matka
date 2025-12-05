import { LoaderFunction, redirect } from "react-router";
import {
    buildDestroySessionHeader,
    getSession as getCachedSession,
    commitSession,
} from "~/services/session/cacheSession.server";
import {
    getBffSession as getSessionFromBff,
    verifyBffSession,
} from "~/services/session/sessionProvider.server";
import { computeMaxAgeFromExp } from "~/utils/expiryUtils.server";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const {
        sessionId,
        source: productId,
        kycType,
        appId: applicationId,
        name: companyName,
        orgNumber,
    } = searchParams;

    if (!sessionId || !productId) {
        throw new Response("Missing required query parameters", {
            status: 400,
            statusText: "Bad Request",
        });
    }

    const { status, ttl } = await verifyBffSession(productId, sessionId);
    if (!status || !ttl) {
        const headers = await buildDestroySessionHeader(request);
        throw new Response("Invalid or expired session", {
            status: 401,
            statusText: "Unauthorized",
            headers,
        });
    }

    const sessionData = await getSessionFromBff(sessionId, productId);
    if (!sessionData) {
        const headers = await buildDestroySessionHeader(request);
        throw new Response("Failed to fetch session data from BFF", {
            status: 500,
            statusText: "Internal Server Error",
            headers,
        });
    }
    const {
        maxSessionRefresh = 1,
        sessionRefreshCount = 0,
        userInfo: { sub: kcUserId = "" } = {},
    } = sessionData || {};

    // create a session object and commit via SessionStorage
    console.log("start cache-session FLOW");
    const exp = sessionData.exp;
    const maxAge = computeMaxAgeFromExp(exp);
    const expMS = exp * 1000; // exp from authentication/sessionInfo is in sec
    const session = await getCachedSession(request.headers.get("cookie"));
    const sessionValues = {
        sessionId,
        clientId: productId,
        applicationId,
        kcUserId,
        sessionRefreshCount,
        maxSessionRefresh,
        exp: expMS,
        companyName,
        orgNumber,
    };

    Object.entries(sessionValues).forEach(([k, v]) => {
        if (v !== undefined) session.set(k, v);
    });

    // commitSession will call createData/updateData under the hood (which will call BFF endpoints).
    const cookieHeader = await commitSession(session, { maxAge }); // store session

    return redirect(`/${productId}/${kycType}`, {
        headers: {
            "Set-Cookie": cookieHeader,
        },
    });
};

export default function Index() {
    return null;
}
