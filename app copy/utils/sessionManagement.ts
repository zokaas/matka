export const handleRefreshSession = async (
    sessionId: string,
    clientId: string
): Promise<{ exp: number; sessionRefreshCount: number } | null> => {
    const params = new URLSearchParams({
        sessionId,
        clientId,
    });
    try {
        console.log("[SessionManager] Refreshing session via BFF...", { sessionId, clientId });
        const res = await fetch(`/refresh-session?${params.toString()}`);
        if (!res.ok) {
            console.warn("[SessionManager] Refresh request failed:", res.status);
            throw new Error("Refresh failed");
        }

        const data = await res.json();

        // Normalize exp => milliseconds
        let exp = data?.exp;
        if (typeof exp !== "number") return null;
        // if seconds (epoch ~ 1.7e9), convert to ms (epoch ~ 1.7e12)
        if (exp < 1e12) exp = exp * 1000;

        const sessionRefreshCount = data?.sessionRefreshCount;
        if (typeof sessionRefreshCount !== "number") return null;

        return { exp, sessionRefreshCount };
    } catch (err) {
        console.error("[SessionManager] Error during session refresh:", err);
        return null;
    }
};
