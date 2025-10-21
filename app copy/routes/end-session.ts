import { ActionFunction } from "react-router";
import { endSession } from "~/services/sessionProvider.server";
import { endOwnSession, getSessionData } from "~/services/sessionStorage.server";

export const action: ActionFunction = async ({ request }) => {
    const sessionId = await getSessionData(request, "sessionId");
    const clientId = await getSessionData(request, "productId");

    if (!sessionId || !clientId) {
        return new Response(JSON.stringify({ error: "Session or client ID not found" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    console.log("destroy session on bff");

    let backendStatus: number | null = null;

    try {
        // destroy session on BFF
        const result = await endSession(sessionId, clientId);
        backendStatus = result?.status ?? null;
        console.log("Backend logout result:", result);
    } catch (error) {
        console.error("Error calling backend logout:", error);
    }
    if (backendStatus === 200 || backendStatus === 403 || backendStatus === null) {
        // Destroy local cookie session
        try {
            const cookieHeader = await endOwnSession(request);

            return new Response(
                JSON.stringify({ success: true, message: "Session ended successfully" }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Set-Cookie": cookieHeader, // clears the _session cookie
                    },
                }
            );
        } catch (cookieError) {
            console.error("Failed to clear local session cookie:", cookieError);
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Session ended, but cookie removal failed",
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }
    }
    return new Response(JSON.stringify({ success: false, message: "Failed to end session" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
};
