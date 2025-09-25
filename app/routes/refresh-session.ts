// app/routes/refresh-session.ts
import type { LoaderFunctionArgs } from "react-router";
import { refreshSession } from "~/services/api/refresh-session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");
    const clientId = url.searchParams.get("clientId");

    if (!sessionId || !clientId) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const result = await refreshSession(sessionId, clientId);
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Failed to refresh session:", e);
        return new Response(JSON.stringify({ error: "Failed refreshing session" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
