import { useEffect, useRef } from "react";
import { T_RefreshResult } from "./types";
import { T_SessionModalType } from "apps/kyc/components/SessionModal/types";
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
}: {
    expiresAtMs: number;
    getLastActivity: () => number;
    refreshCount: number;
    maxRefresh: number;
    onAttemptRefresh: () => Promise<T_RefreshResult>;
    onShowModal: (type?: T_SessionModalType) => void;
}) {
    const navigate = useNavigate();

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!expiresAtMs) return;

        const now = Date.now();
        const warningTime = 60 * 1000; // show/attempt 60s before expiry
        const delay = expiresAtMs - now - warningTime;

        if (delay <= 0) {
            // already within warning window: show modal immediately
            onShowModal("refresh");
            return;
        }

        // clear any existing timer
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            console.log("[useExpiryTimer] refreshCount maxRefresh: ", refreshCount, maxRefresh);
            // if reached max refreshes => inform user
            if (refreshCount >= maxRefresh) {
                console.log("[useExpiryTimer] reached max refreshes");
                onShowModal("expired");
                return;
            }

            // Determine if user was recently active (within N ms)
            const INACTIVITY_LIMIT = 30 * 1000; // 30 seconds
            const inactiveMs = Date.now() - getLastActivity();
            const isActiveRecently = inactiveMs < INACTIVITY_LIMIT;
            console.log("[useExpiryTimer] is user active recently: ", isActiveRecently);
            if (isActiveRecently) {
                // try to refresh
                try {
                    const res = await onAttemptRefresh();
                    if (!res) {
                        // refresh failed or returned invalid payload
                        navigate("/error");
                    }
                } catch (err) {
                    console.error("[useExpiryTimer] refresh error", err);
                    navigate("/error");
                }
            } else {
                // user inactive -> show modal
                onShowModal("refresh");
            }
        }, delay);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [expiresAtMs, refreshCount, maxRefresh, getLastActivity, onAttemptRefresh, onShowModal]);
}
