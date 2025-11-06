import { ActionFunction } from "react-router";
import { endSession } from "~/services/sessionProvider.server";
import { endOwnSession, getSessionData } from "~/services/sessionStorage.server";

type T_BackendInfo = {
    status: number | null;
    ok: boolean;
    message?: string;
};

type T_EndSessionResponse = {
    success: boolean;
    message: string;
    backend?: T_BackendInfo;
    cookieCleared: boolean;
};

export const action: ActionFunction = async ({ request }) => {
    const sessionId = await getSessionData(request, "sessionId");
    const clientId = await getSessionData(request, "productId");

    if (!sessionId || !clientId) {
        return jsonResponse(
            {
                success: false,
                message: "Session or client ID not found",
                cookieCleared: false,
            } as T_EndSessionResponse,
            400
        );
    }

    let backendStatus: number | null = null;
    let backendOk = false;
    let backendMessage: string | undefined;

    try {
        // destroy session on BFF
        const result = await endSession(sessionId, clientId);
        backendStatus = result?.status ?? null;
        backendOk = backendStatus === 200 || backendStatus === 204;
        backendMessage = "Backend logout completed";
        console.log("Backend logout result:", result);
    } catch (err) {
        backendStatus = null;
        backendOk = false;
        backendMessage = String(err ?? "Unknown error calling backend logout");
        console.error("Error calling backend logout:", err);
    }
    // attempt to clear local session cookie
    let cookieHeader: string | null = null;
    let cookieCleared = false;

    try {
        cookieHeader = await endOwnSession(request); // should return Set-Cookie value that clears the cookie
        cookieCleared = Boolean(cookieHeader);
    } catch (cookieErr) {
        console.error("Failed to clear local session cookie:", cookieErr);
        cookieCleared = false;
    }

    // Build the response body describing what happened
    const body: T_EndSessionResponse = {
        success: true,
        message: cookieCleared
            ? "Session ended locally."
            : "Session endpoint hit. Local cookie clearing failed; you may still be signed in in this browser.",
        cookieCleared,
        backend: {
            status: backendStatus,
            ok: backendOk,
            message: backendMessage,
        },
    };

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (cookieCleared && cookieHeader) {
        headers["Set-Cookie"] = cookieHeader;
    }

    return new Response(JSON.stringify(body), { status: 200, headers });
};

function jsonResponse(payload: unknown, status = 200) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}
