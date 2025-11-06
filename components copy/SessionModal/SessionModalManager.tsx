import React, { useEffect, useRef, useState } from "react";
import { ModalDialog } from "@ui/modal";
import { T_SessionModalPayload } from "./types";
import { useRedirectToLogin } from "~/hooks";
import { useSession } from "~/context/SessionContext";
import { T_SessionModal } from "~/types";
import { redirectToMarketingPage } from "~/utils/navigation";

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
    productId,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    /**
     * fatal holds either an Error or a Response object.
     * When set, a thrower component is rendered during render so ErrorBoundary catches it.
     */
    const [fatal, setFatal] = useState<Error | Response | null>(null);
    const autoLogoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { session, refreshSession } = useSession();
    const redirectToLogin = useRedirectToLogin(session.applicationId ?? "");

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
                const response = new Response("Session expired", {
                    status: 440, // 440 = Login Timeout
                    statusText: "Session Expired",
                });
                setFatal(response);
            }, ms);
        };

        window.addEventListener("session:modal:show", onShow as EventListener);
        return () => {
            window.removeEventListener("session:modal:show", onShow as EventListener);
            clearAutoLogoutTimer();
        };
    }, [session.applicationId]);

    /**
     * Handle "Continue" button:
     * - If expired modal: redirect to login.
     * - Otherwise attempt an in-place refresh via refreshSession().
     *   If refresh fails (res falsy), trigger the ErrorBoundary by setting fatalError.
     */
    const handleContinue = async () => {
        clearAutoLogoutTimer();

        if (modalType === "expired") {
            console.log("Expired, redirect to login page", "start/");
            return redirectToLogin();
        }

        setIsLoading(true);
        console.log("Continue session");

        try {
            const res = await refreshSession();
            if (!res) {
                const response = new Response("Session refresh failed", {
                    status: 401,
                    statusText: "Unauthorized",
                });
                setFatal(response);
                return;
            }
            setIsOpen(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown session refresh error";
            const response = new Response(message, {
                status: 500,
                statusText: "Session Refresh Error",
            });

            throw response;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        clearAutoLogoutTimer();
        setIsLoading(true);

        try {
            const res = await fetch("/end-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
            });

            let payload: {
                success?: boolean;
                cookieCleared?: boolean;
                backend?: { ok?: boolean; status?: number; message?: string };
            } | null = null;

            try {
                payload = await res.json();
            } catch {
                // non-JSON response, ignore
            }

            if (!res.ok) {
                console.warn("end-session responded with error status:", res.status, payload);
            }

            // Log any backend issues but don’t block user logout
            if (payload?.backend && !payload.backend.ok) {
                console.warn("Backend logout failed:", payload.backend);
            }

            if (payload?.cookieCleared === false) {
                console.warn("Local session cookie may not have been cleared.");
            }

            // Close modal and navigate away (to opr.se?)
            setIsOpen(false);
            redirectToMarketingPage(productId);
        } catch (err) {
            console.error("Logout request failed:", err);
            setIsOpen(false);
            redirectToMarketingPage(productId);
        } finally {
            setIsLoading(false);
        }
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
