import { showSessionModal } from "apps/kyc/components";
import { useEffect, useState } from "react";
import { useActivityTracker } from "./useActivityTracker";
import { T_RefreshResult, T_SessionLoaderData } from "./types";
import { useExpiryTimer } from "./useExpiryTimer";
import { T_SessionModalPayload } from "apps/kyc/components/sessionModal/types";
import { useLoaderData } from "react-router";
import { requestSessionRefresh } from "~/services";

export const useSessionManager = () => {
    const loaderData = useLoaderData<T_SessionLoaderData>();
    const { exp, sessionRefreshCount, maxSessionRefresh } = loaderData;
    const now = () => Date.now();
    const [expiresAt, setExpiresAt] = useState<number>(exp ?? 0);
    const [refreshCount, setRefreshCount] = useState<number>(sessionRefreshCount ?? 0);

    const { getLastActivity } = useActivityTracker();

    const [fatalResponse, setFatalResponse] = useState<Response | null>(null);

    // function invoked by timer or modal to attempt refresh
    const attemptRefresh = async (): Promise<T_RefreshResult | null> => {
        try {
            const res = await requestSessionRefresh();
            if (!res) return null;
            setExpiresAt(res.exp);
            setRefreshCount(res.sessionRefreshCount);
            return res;
        } catch (err) {
            console.error("attemptRefresh error", err);
            return null;
        }
    };

    useEffect(() => {
        // Handler for requests from the modal UI
        const onRefreshRequest = async () => {
            try {
                const res = await attemptRefresh();
                if (!res) {
                    const resp = new Response("Session refresh failed", {
                        status: 401,
                        statusText: "Unauthorized",
                    });
                    window.dispatchEvent(
                        new CustomEvent("session:refresh-response", {
                            detail: { success: false, response: resp },
                        })
                    );
                    return;
                }

                window.dispatchEvent(
                    new CustomEvent("session:refresh-response", {
                        detail: { success: true, result: res },
                    })
                );
            } catch (err) {
                console.error("[useSessionManager] refresh on request failed:", err);
                const message = err instanceof Error ? err.message : "Unknown refresh error";
                const resp = new Response(message, {
                    status: 500,
                    statusText: "Session Refresh Error",
                });
                window.dispatchEvent(
                    new CustomEvent("session:refresh-response", {
                        detail: { success: false, response: resp },
                    })
                );
            }
        };

        window.addEventListener("session:refresh-request", onRefreshRequest as EventListener);

        return () => {
            window.removeEventListener(
                "session:refresh-request",
                onRefreshRequest as EventListener
            );
        };
    }, [attemptRefresh]);

    const onShowModal = (payload: T_SessionModalPayload) => showSessionModal(payload);

    const onFatal = (response: Response) => {
        // store the response so the mounting component can render a thrower during render
        setFatalResponse(response);
    };

    useExpiryTimer({
        expiresAtMs: expiresAt,
        getLastActivity,
        refreshCount,
        maxRefresh: maxSessionRefresh ?? 1,
        onAttemptRefresh: attemptRefresh,
        onShowModal,
        onFatal,
        now,
    });

    return fatalResponse;
};
