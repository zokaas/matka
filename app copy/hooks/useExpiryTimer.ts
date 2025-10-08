import { useEffect, useRef } from "react";
import type { T_RefreshResult } from "./types";
import type { T_SessionModalPayload } from "apps/kyc/components/SessionModal/types";
import { useNavigate } from "react-router";

/**
 * Hook: manages the single timer that triggers warning/refresh logic.
 */
export function useExpiryTimer({
    expiresAtMs,
    getLastActivity,
    refreshCount,
    maxRefresh,
    onAttemptRefresh,
    onShowModal,
    now,
}: {
    expiresAtMs: number;
    getLastActivity: () => number;
    refreshCount: number;
    maxRefresh: number;
    onAttemptRefresh: () => Promise<T_RefreshResult | null>;
    onShowModal: (payload: T_SessionModalPayload) => void;
    now: () => number;
}) {
    const navigate = useNavigate();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Only the timer created for this exp may act; others are stale
    const activeExpRef = useRef<number>(0);

    // prevent multiple fires for the *same* exp within the warning window
    const firedForExpRef = useRef<number | null>(null);

    const isVisible = () =>
        typeof document !== "undefined" && document.visibilityState === "visible";

    useEffect(() => {
        if (!expiresAtMs) return;

        activeExpRef.current = expiresAtMs;

        const WARNING_TIME = 10_000; // CHANGED: 60_000 → 10_000 (10 seconds)
        const delay = Math.max(0, expiresAtMs - now() - WARNING_TIME);

        if (timerRef.current) clearTimeout(timerRef.current);

        const expForThisTimer = expiresAtMs;

        const fire = async () => {
            if (activeExpRef.current !== expForThisTimer) return;

            // Prevent re-firing for the same exp in the same warning window
            if (firedForExpRef.current === expForThisTimer) return;
            firedForExpRef.current = expForThisTimer;

            // If we already hit max refreshes, inform the user (final window)
            if (refreshCount >= maxRefresh) {
                const remainingMs = Math.max(0, expForThisTimer - now());
                console.log("expiring", remainingMs);
                onShowModal({ type: "expired", remainingMs });
                return;
            }

            if (!isVisible()) {
                const vis = () => {
                    document.removeEventListener("visibilitychange", vis);
                    // Re-run only if this timer is still current
                    if (activeExpRef.current === expForThisTimer) void fire();
                };
                document.addEventListener("visibilitychange", vis, { once: true });
                return;
            }

            const INACTIVITY_LIMIT = 10_000;
            const inactiveMs = now() - getLastActivity();
            const isActiveRecently = inactiveMs < INACTIVITY_LIMIT;

            if (isActiveRecently) {
                try {
                    const res = await onAttemptRefresh();
                    if (!res) navigate("/error");
                    // On success, expiresAtMs will change, replacing activeExpRef and cancelling this timer
                } catch (err) {
                    console.error("[useExpiryTimer] refresh error", err);
                    navigate("/error");
                }
            } else {
                const remainingMs = Math.max(5_000, expForThisTimer - now());
                onShowModal({ type: "refresh", remainingMs });
            }
        };

        if (delay === 0) {
            void fire();
        } else {
            timerRef.current = setTimeout(fire, delay);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [
        expiresAtMs,
        refreshCount,
        maxRefresh,
        getLastActivity,
        onAttemptRefresh,
        onShowModal,
        now,
        navigate,
    ]);
}
