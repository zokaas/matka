import React, { useEffect, useRef, useState } from "react";
import { ModalDialog } from "@ui/modal";
import { T_SessionModalPayload } from "./types";
import { T_SessionModal } from "~/types";
import { redirectToLogin, redirectToMarketingPage } from "~/utils";
import { callEndSession } from "~/services";

/**
 * Fire a global event to show the session modal.
 */
export function showSessionModal(payload: T_SessionModalPayload) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent<T_SessionModalPayload>("session:modal:show", { detail: payload })
    );
}

/**
 * throws the given error during render.
 */
function ThrowError({ error }: { error: Error }): never {
    throw error;
}

/**
 * Throws a Response during render
 */
function ThrowResponse({ response }: { response: Response }): never {
    throw response;
}

export const SessionModalManager: React.FC<T_SessionModal> = ({
    refreshTitle,
    refreshDescription,
    continueSessionButton,
    expiredTitle,
    expiredDescription,
    loginButton,
    logoutButton,
    sessionData,
}) => {
    const { applicationUuid, productId } = sessionData;
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    /**
     * fatal holds either an Error or a Response object.
     * When set, a thrower component is rendered during render so ErrorBoundary catches it.
     */
    const [fatal, setFatal] = useState<Error | Response | null>(null);
    const autoLogoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleRedirectToLogin = () => {
        const id = applicationUuid ?? localStorage.getItem("applicationUuid");
        // call end-session then redirect to login
        void doEndSession(() => redirectToLogin(id));
    };

    const refreshModalContent = {
        title: refreshTitle,
        description: refreshDescription,
        continueButton: continueSessionButton,
        logoutButton: logoutButton,
    };

    const expiredModalContent = {
        title: expiredTitle,
        description: expiredDescription,
        continueButton: loginButton,
        logoutButton: logoutButton,
    };

    const modalContent = modalType === "expired" ? expiredModalContent : refreshModalContent;

    const { title, description, continueButton, logoutButton: logoutText } = modalContent;

    // Clears any pending auto-logout timer
    const clearAutoLogoutTimer = () => {
        if (autoLogoutTimerRef.current) {
            clearTimeout(autoLogoutTimerRef.current);
            autoLogoutTimerRef.current = null;
        }
    };

    useEffect(() => {
        const onShow = (ev: Event) => {
            const d = (ev as CustomEvent<T_SessionModalPayload>).detail;
            setModalType(d.type);
            setIsOpen(true);

            const ms = Math.max(5_000, typeof d.remainingMs === "number" ? d.remainingMs : 60_000);
            clearAutoLogoutTimer();
            autoLogoutTimerRef.current = setTimeout(() => {
                return handleRedirectToLogin();
            }, ms);
        };

        window.addEventListener("session:modal:show", onShow as EventListener);
        return () => {
            window.removeEventListener("session:modal:show", onShow as EventListener);
            clearAutoLogoutTimer();
        };
    }, [applicationUuid]);

    const doEndSession = async (redirectFn: () => void) => {
        if (isLoading) return;
        clearAutoLogoutTimer();
        setIsLoading(true);

        try {
            await callEndSession();
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            // Close modal and navigate regardless of outcome (mirror original behavior)
            try {
                setIsOpen(false);
                redirectFn();
            } finally {
                setIsLoading(false);
            }
        }
    };
    /**
     * Handle "Continue" button:
     * - If expired modal: redirect to login.
     * - Otherwise request a refresh (dispatch) and wait for a response.
     *   If refresh fails (res falsy), trigger the ErrorBoundary by setting fatalError.
     */
    const handleContinue = async () => {
        clearAutoLogoutTimer();

        if (modalType === "expired") {
            console.log("Expired, redirect to login page", "start/");
            return handleRedirectToLogin();
        }

        setIsLoading(true);
        console.log("Continue session (UI requests manager to refresh)");

        // Helper: wait for a single 'session:refresh-response' event or timeout
        const waitForRefreshResponse = (timeoutMs = 15000) =>
            new Promise<{ success: boolean; response?: Response }>((resolve) => {
                let timer: ReturnType<typeof setTimeout> | null = null;

                const onResponse = (ev: Event) => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    const detail = (ev as CustomEvent).detail ?? {};
                    window.removeEventListener(
                        "session:refresh-response",
                        onResponse as EventListener
                    );
                    resolve(detail);
                };

                // one-time handler
                window.addEventListener("session:refresh-response", onResponse as EventListener);

                // safety timeout — resolve with failure if manager doesn't answer
                timer = setTimeout(() => {
                    window.removeEventListener(
                        "session:refresh-response",
                        onResponse as EventListener
                    );
                    resolve({
                        success: false,
                        response: new Response("Session refresh timeout", {
                            status: 504,
                            statusText: "Gateway Timeout",
                        }),
                    });
                }, timeoutMs);

                // dispatch request (manager will perform the actual refresh)
                window.dispatchEvent(new CustomEvent("session:refresh-request"));
            });

        try {
            const { success, response } = await waitForRefreshResponse(15000);

            if (!success) {
                // Manager reported failure (or timed out) — render ErrorBoundary via fatal
                const resp =
                    response instanceof Response
                        ? response
                        : new Response("Session refresh failed", {
                              status: 401,
                              statusText: "Unauthorized",
                          });
                setFatal(resp);
                return;
            }

            setIsOpen(false);
        } catch (err) {
            console.error("handleContinue unexpected error", err);
            const message = err instanceof Error ? err.message : "Unknown error during refresh";
            setFatal(new Response(message, { status: 500, statusText: "Session Refresh Error" }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        void doEndSession(() => redirectToMarketingPage(productId));
    };

    if (fatal) {
        if (fatal instanceof Response) {
            return <ThrowResponse response={fatal} />;
        }
        return <ThrowError error={fatal} />;
    }

    return (
        <ModalDialog
            isOpen={isOpen}
            title={title}
            description={description}
            firstActionText={continueButton}
            secondActionText={logoutText}
            firstAction={handleContinue}
            secondAction={handleLogout}
            isLoading={isLoading}
        />
    );
};
