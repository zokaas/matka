import { useEffect, useRef } from "react";

export function useExternalRefreshListener(
    onRefreshed: (payload: { exp: number; sessionRefreshCount: number }) => void
) {
    const lastSeenRef = useRef<{ exp: number; sessionRefreshCount: number } | null>(null);

    useEffect(() => {
        const handlePayload = (p: { exp: number; sessionRefreshCount: number }) => {
            // Normalize to ms if needed
            const expMs = p.exp < 1e12 ? p.exp * 1000 : p.exp;
            const normalized = { exp: expMs, sessionRefreshCount: p.sessionRefreshCount };

            const last = lastSeenRef.current;
            if (
                last &&
                last.exp === normalized.exp &&
                last.sessionRefreshCount === normalized.sessionRefreshCount
            ) {
                return;
            }
            lastSeenRef.current = normalized;
            onRefreshed(normalized);
        };

        const handler = (ev: Event) => {
            try {
                const detail = (ev as CustomEvent<{ exp: number; sessionRefreshCount: number }>)
                    .detail;
                if (detail && typeof detail.exp === "number") {
                    handlePayload(detail);
                }
            } catch (err) {
                console.error("session:refreshed handler error", err);
            }
        };

        window.addEventListener("session:refreshed", handler as EventListener);

        let bc: BroadcastChannel | null = null;
        if ("BroadcastChannel" in window) {
            bc = new BroadcastChannel("session");
            bc.onmessage = (msg) => {
                if (msg?.data?.type === "refreshed" && msg.data.payload) {
                    handlePayload(msg.data.payload);
                }
            };
        }

        return () => {
            window.removeEventListener("session:refreshed", handler as EventListener);
            if (bc) bc.close();
        };
    }, [onRefreshed]);
}
