import React, { useEffect, useRef, useState } from "react";
import { ModalDialog } from "@ui/modal";
import { T_SessionModalPayload } from "./types";
import { useRedirectToLogin } from "~/hooks";
import { useSession } from "~/context/SessionContext";

export function showSessionModal(payload: T_SessionModalPayload) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent<T_SessionModalPayload>("session:modal:show", { detail: payload })
    );
}

export const SessionModalManager: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const autoLogoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { session, refreshSession } = useSession();
    const redirectToLogin = useRedirectToLogin(session.applicationId ?? "");

    // TODO translations from strapi

    const refreshModalContent = {
        title: "Session Expiring",
        description: "Your session is about to expire. Do you want to continue?",
        continueButton: "Continue Session",
        logoutButton: "Logout",
    };

    const expiredModalContent = {
        title: "Session Expired",
        description:
            "You have reached the maximum session refresh limit. To continue, you should log in again.",
        continueButton: "Log in again",
        logoutButton: "Logout",
    };

    const modalContent = modalType === "expired" ? expiredModalContent : refreshModalContent;

    const { title, description, continueButton, logoutButton } = modalContent;

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
                window.location.assign(
                    `/expired?appId=${encodeURIComponent(session.applicationId ?? "")}`
                );
            }, ms);
        };

        window.addEventListener("session:modal:show", onShow as EventListener);
        return () => {
            window.removeEventListener("session:modal:show", onShow as EventListener);
            clearAutoLogoutTimer();
        };
    }, [session.applicationId]);

    const handleContinue = async () => {
        clearAutoLogoutTimer();

        if (modalType === "expired") {
            console.log("Expired, redirect to login page", "start/");
            return redirectToLogin();
        }

        setIsLoading(true);
        console.log("Continue session");

        const res = await refreshSession();
        if (!res) {
            window.location.assign("/error");
            return;
        }
        setIsOpen(false);
        setIsLoading(false);
    };

    const handleLogout = async () => {
        clearAutoLogoutTimer();
        setIsLoading(true);
        try {
            const res = await fetch("/end-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                console.error("Failed to end session");
                // Fall back to an error page if the endpoint fails
                window.location.assign("/error");
                return;
            }

            // Close modal and go to the logout route
            setIsOpen(false);
            window.location.assign("/logout");
        } catch (err) {
            console.error("Logout request failed:", err);
            window.location.assign("/error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalDialog
            isOpen={isOpen}
            title={title}
            description={description}
            firstActionText={continueButton}
            secondActionText={logoutButton}
            firstAction={handleContinue}
            secondAction={handleLogout}
            isLoading={isLoading}
        />
    );
};
