import type { ActionFunction } from "react-router";
import {
    buildDestroySessionHeader,
    commitSession,
    getSession,
} from "~/services/session/cacheSession.server";
import { refreshBffSession } from "~/services/session/sessionProvider.server";
import { computeMaxAgeFromExp } from "~/utils/expiryUtils.server";

export const action: ActionFunction = async ({ request }) => {
    // read server session (cookie)
    const cookieHeader = request.headers.get("cookie") ?? "";
    const session = await getSession(cookieHeader);

    const sessionId = session.get("sessionId");
    const clientId = session.get("clientId");

    if (!sessionId || !clientId) {
        return new Response(JSON.stringify({ error: "Missing session" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const result = await refreshBffSession(sessionId, clientId);
        if (!result || !result.sessionId || !result.exp) {
            const destroyHeaders = await buildDestroySessionHeader(request);
            return new Response(JSON.stringify({ error: "Session refresh failed" }), {
                status: 401,
                headers: {
                    ...destroyHeaders,
                    "Content-Type": "application/json",
                },
            });
        }

        // normalize exp to ms on server if needed
        let exp = result.exp;
        const maxAge = computeMaxAgeFromExp(exp);
        if (typeof exp === "number" && exp < 1e12) exp = exp * 1000;

        // update server session values and commit cookie
        session.set("exp", exp);
        session.set("sessionRefreshCount", result.sessionRefreshCount ?? 0);
        session.set("sessionId", result.sessionId);
        const setCookie = await commitSession(session, { maxAge });

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                "Set-Cookie": setCookie,
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("refresh action error", err);
        const destroyHeaders = await buildDestroySessionHeader(request);
        return new Response(JSON.stringify({ error: "Failed refreshing session" }), {
            status: 500,
            headers: {
                ...destroyHeaders,
                "Content-Type": "application/json",
            },
        });
    }
};
