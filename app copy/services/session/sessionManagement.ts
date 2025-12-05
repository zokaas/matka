import { T_RefreshSessionResponse } from "~/services";

export const requestSessionRefresh = async (): Promise<{
    exp: number;
    sessionRefreshCount: number;
} | null> => {
    try {
        console.log("[requestSessionRefresh] Refreshing session via BFF...");
        const res = await fetch("/refresh-session", {
            method: "POST",
            credentials: "include", // send cookies
            headers: {
                Accept: "application/json",
            },
        });
        if (!res.ok) {
            console.warn("[requestSessionRefresh] failed:", res.status);
            return null;
        }

        const data: T_RefreshSessionResponse = await res.json();

        // Normalize exp => milliseconds
        let exp = data?.exp;
        if (typeof exp !== "number") return null;
        // if seconds convert to ms
        if (exp < 1e12) exp = exp * 1000;

        const sessionRefreshCount = data?.sessionRefreshCount;
        if (typeof sessionRefreshCount !== "number") return null;

        return { exp, sessionRefreshCount };
    } catch (err) {
        console.error("[requestSessionRefresh] Error:", err);
        return null;
    }
};

export async function callEndSession() {
    try {
        await fetch("/end-session", {
            method: "POST",
            credentials: "same-origin",
        });
    } catch (err) {
        console.error("Failed to end session", err);
    }
}
