import { LoaderFunction, redirect } from "react-router";
import { getSession as getSessionFromBff, verifySession } from "~/services/sessionProvider.server";
import { saveSession } from "~/services/sessionStorage.server";

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

    const { status, ttl } = await verifySession(productId, sessionId);
    if (!status || !ttl) {
        throw new Response("Invalid or expired session", {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const sessionData = await getSessionFromBff(sessionId, productId);
    if (!sessionData) {
        throw new Response("Failed to fetch session data from BFF", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
    console.log("sessionData", sessionData);
    const {
        maxSessionRefresh = 1,
        sessionRefreshCount = 0,
        userInfo: { sub: kcUserId = "" } = {},
    } = sessionData || {};

    // Save session data in the session cookie and redirect to dynamic route
    const dataToStore = {
        sessionId,
        productId,
        kycType,
        applicationId,
        ttl,
        companyName,
        orgNumber,
        maxSessionRefresh,
        sessionRefreshCount,
        kcUserId,
    };
    const sessionCookie = await saveSession(dataToStore);

    return redirect(`/${productId}/${kycType}`, {
        headers: {
            "Set-Cookie": sessionCookie,
        },
    });
};

export default function Index() {
    return null;
}
