import React, { createContext, useContext, useState, useCallback } from "react";
import type { T_RefreshResult } from "~/hooks/types";
import { handleRefreshSession } from "~/utils/sessionManagement";

type T_ContextSessionData = {
    sessionId?: string;
    productId?: string;
    applicationId?: string;
    exp?: number; // expiry timestamp
    maxSessionRefresh?: number;
    sessionRefreshCount?: number;
};

type SessionContextType = {
    session: T_ContextSessionData;
    refreshSession: () => Promise<T_RefreshResult | null>;
    updateSession: (updates: Partial<T_ContextSessionData>) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
    initialSession,
    children,
}: {
    initialSession: T_ContextSessionData;
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<T_ContextSessionData>(initialSession);

    const updateSession = (updates: Partial<T_ContextSessionData>) =>
        setSession((prev) => ({ ...prev, ...updates }));

    const refreshSession = useCallback(async () => {
        if (!session.sessionId || !session.productId) return null;
        try {
            const res = await handleRefreshSession(session.sessionId, session.productId);
            if (res) {
                updateSession({
                    exp: res.exp,
                    sessionRefreshCount: res.sessionRefreshCount,
                });
            }
            return res;
        } catch (err) {
            console.error("Session refresh failed:", err);
            return null;
        }
    }, [session.sessionId, session.productId]);

    return (
        <SessionContext.Provider value={{ session, refreshSession, updateSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used within SessionProvider");
    return ctx;
}
