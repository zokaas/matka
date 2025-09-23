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
        if (!data || typeof data.exp !== "number" || typeof data.sessionRefreshCount !== "number") {
            console.error("[SessionManager] Invalid refresh response:", res);
            return null;
        }
        console.log(
            "[SessionManager] Session refreshed. New exp:",
            data.exp,
            "New refresh count:",
            data.sessionRefreshCount
        );

        // Dispatch event so other hooks/components can react if needed (optional)
        window.dispatchEvent(
            new CustomEvent("session:refreshed", {
                detail: {
                    exp: data.exp,
                    sessionRefreshCount: data.sessionRefreshCount,
                },
            })
        );

        return { exp: data.exp, sessionRefreshCount: data.sessionRefreshCount };
    } catch (err) {
        console.error("[SessionManager] Error during session refresh:", err);
        return null;
    }
};
