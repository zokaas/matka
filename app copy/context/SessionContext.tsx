import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from "react";
import type { T_RefreshResult } from "~/hooks/types";
import { handleRefreshSession } from "~/utils/sessionManagement";

type SessionStatus = "active" | "suppressed" | "destroyed" | "expired";

type T_ContextSessionData = {
    sessionId?: string;
    productId?: string;
    applicationId?: string;
    exp?: number; // expiry timestamp
    maxSessionRefresh?: number;
    sessionRefreshCount?: number;
    serverNow?: number; // absolute ms
    theme: string;
    status?: SessionStatus;
};

type T_SessionValue = T_ContextSessionData & {
    driftMs: number;
    now: () => number;
};

type T_SessionContextType = {
    session: T_SessionValue;
    refreshSession: () => Promise<T_RefreshResult | null>;
    updateSession: (updates: Partial<T_ContextSessionData>) => void;
    setStatus: (s: SessionStatus) => void;
    destroySession: () => void;
};

const SessionContext = createContext<T_SessionContextType | undefined>(undefined);

export function SessionProvider({
    initialSession,
    children,
}: {
    initialSession: T_ContextSessionData;
    children: React.ReactNode;
}) {
    const initial: T_ContextSessionData & { status: SessionStatus } = {
        ...initialSession,
        status: initialSession.sessionId
            ? ("active" as SessionStatus)
            : ("destroyed" as SessionStatus),
    };

    const [session, setSession] = useState<T_ContextSessionData>(initial);

    // Compute drift (serverNow - clientNow)
    const [driftMs] = useState<number>(() => {
        if (typeof initial.serverNow === "number") {
            return initial.serverNow - Date.now();
        }
        return 0;
    });

    const now = useCallback(() => Date.now() + driftMs, [driftMs]);

    const updateSession = useCallback((updates: Partial<T_ContextSessionData>) => {
        setSession((prev) => ({ ...prev, ...updates }));
    }, []);

    const setStatus = useCallback((s: SessionStatus) => {
        setSession((prev) => ({ ...prev, status: s }));
        // broadcast status change to other tabs
        try {
            window.dispatchEvent(new CustomEvent("session:status", { detail: s }));
            if ("BroadcastChannel" in window) {
                const bc = new BroadcastChannel("session");
                bc.postMessage({ type: "status", payload: s });
                bc.close();
            }
        } catch {
            // ignore
        }
    }, []);

    const destroySession = useCallback(() => {
        // clear sensitive fields and mark destroyed
        setSession((prev) => ({
            ...prev,
            status: "destroyed",
            sessionId: undefined,
            exp: undefined,
            sessionRefreshCount: 0,
            maxSessionRefresh: 0,
        }));

        try {
            window.dispatchEvent(new CustomEvent("session:destroyed"));
            if ("BroadcastChannel" in window) {
                const bc = new BroadcastChannel("session");
                bc.postMessage({ type: "destroyed" });
                bc.close();
            }
        } catch {
            // ignore
        }
    }, []);

    // single-flight refresh semaphore
    const inFlightRef = useRef<Promise<T_RefreshResult | null> | null>(null);

    const refreshSession = useCallback(async (): Promise<T_RefreshResult | null> => {
        if (session.status !== "active") {
            return null;
        }

        const { sessionId, productId, maxSessionRefresh, sessionRefreshCount } = session;
        if (!sessionId || !productId) return null;

        // guard: max refresh reached
        if (
            typeof maxSessionRefresh === "number" &&
            typeof sessionRefreshCount === "number" &&
            sessionRefreshCount >= maxSessionRefresh
        ) {
            console.log(sessionRefreshCount, maxSessionRefresh, "Maxrefresh reached");
            return null;
        }

        if (inFlightRef.current) return inFlightRef.current;

        const p = (async () => {
            try {
                const res = await handleRefreshSession(sessionId, productId);
                if (res) {
                    updateSession({ exp: res.exp, sessionRefreshCount: res.sessionRefreshCount });

                    // Emit to other tabs + local listeners
                    try {
                        window.dispatchEvent(new CustomEvent("session:refreshed", { detail: res }));
                        if ("BroadcastChannel" in window) {
                            const bc = new BroadcastChannel("session");
                            bc.postMessage({ type: "refreshed", payload: res });
                            bc.close();
                        }
                    } catch {
                        // ignore
                    }
                }
                return res ?? null;
            } catch (err) {
                console.error("Session refresh failed:", err);
                return null;
            } finally {
                inFlightRef.current = null;
            }
        })();

        inFlightRef.current = p;
        return p;
    }, [session, updateSession]);

    const value = useMemo<T_SessionContextType>(() => {
        return {
            session: { ...session, driftMs, now },
            refreshSession,
            updateSession,
            setStatus,
            destroySession,
        };
    }, [session, driftMs, now, refreshSession, updateSession, setStatus, destroySession]);

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used within SessionProvider");
    return ctx;
}

export function useSessionSafe(): T_SessionContextType | undefined {
    // NOTE: do not throw — this is intentionally permissive for error UIs
    return useContext(SessionContext) ?? undefined;
}
