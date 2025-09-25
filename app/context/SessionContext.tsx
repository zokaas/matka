import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from "react";
import type { T_RefreshResult } from "~/hooks/types";
import { handleRefreshSession } from "~/utils/sessionManagement";

type T_ContextSessionData = {
    sessionId?: string;
    productId?: string;
    applicationId?: string;
    exp?: number; // expiry timestamp
    maxSessionRefresh?: number;
    sessionRefreshCount?: number;
    serverNow?: number; // absolute ms
};

type T_SessionValue = T_ContextSessionData & {
    driftMs: number;
    now: () => number;
};

type T_SessionContextType = {
    session: T_SessionValue;
    refreshSession: () => Promise<T_RefreshResult | null>;
    updateSession: (updates: Partial<T_ContextSessionData>) => void;
};

const SessionContext = createContext<T_SessionContextType | undefined>(undefined);

export function SessionProvider({
    initialSession,
    children,
}: {
    initialSession: T_ContextSessionData;
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<T_ContextSessionData>(initialSession);

    // Compute drift (serverNow - clientNow)
    const [driftMs] = useState<number>(() => {
        if (typeof initialSession.serverNow === "number") {
            return initialSession.serverNow - Date.now();
        }
        return 0;
    });

    const now = useCallback(() => Date.now() + driftMs, [driftMs]);

    const updateSession = useCallback((updates: Partial<T_ContextSessionData>) => {
        setSession((prev) => ({ ...prev, ...updates }));
    }, []);

    // single-flight refresh semaphore
    const inFlightRef = useRef<Promise<T_RefreshResult | null> | null>(null);

    const refreshSession = useCallback(async (): Promise<T_RefreshResult | null> => {
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
        };
    }, [session, driftMs, now, refreshSession, updateSession]);

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used within SessionProvider");
    return ctx;
}
