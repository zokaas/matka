import { useEffect } from "react";

/**
 * Hook: listens for external session:refreshed events and updates local state via callbacks
 */
export function useExternalRefreshListener(
    onRefreshed: (payload: { exp: number; sessionRefreshCount: number }) => void
) {
    useEffect(() => {
        const handler = (ev: Event) => {
            try {
                const detail = (ev as CustomEvent<{ exp: number; sessionRefreshCount: number }>)
                    .detail;
                if (detail && typeof detail.exp === "number") {
                    onRefreshed(detail);
                }
            } catch (err) {
                // ignore malformed events
                console.error("session:refreshed handler error", err);
            }
        };

        window.addEventListener("session:refreshed", handler as EventListener);
        return () => window.removeEventListener("session:refreshed", handler as EventListener);
    }, [onRefreshed]);
}
