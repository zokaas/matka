import React, { useRef, useState } from "react";
import { ModalDialog } from "@ui/modal";
import { T_SessionModalType } from "./types";
import { useRedirectToLogin } from "~/hooks";
import { useSession } from "~/context/SessionContext";

let showModalCallback: ((type?: T_SessionModalType) => void) | null = null;

export const showModal = (type?: T_SessionModalType) => {
    if (showModalCallback) showModalCallback(type);
};

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
        title: "Session Expiring",
        description: "You have reached the maximum session refresh limit. Please log in again.",
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

    const handleContinue = async () => {
        clearAutoLogoutTimer();

        if (modalType === "expired") {
            console.log("Expired, redirect to login page", "start/");
            return redirectToLogin();
        }

        setIsLoading(true);
        console.log("Continue session");
        await refreshSession();
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

    // Allow `useSessionManager` to trigger modal via callback
    showModalCallback = (type?: string) => {
        setModalType(type);
        setIsOpen(true);

        // Auto-logout if user does not respond
        const remainingTime = 60 * 1000; // Default warning window or could be passed dynamically
        autoLogoutTimerRef.current = setTimeout(async () => {
            console.log("Session expired due to inactivity, redirecting...");

            window.location.assign(
                `/expired?appId=${encodeURIComponent(session.applicationId ?? "")}`
            );
        }, remainingTime);
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
