import React from "react";
import { Container } from "@ui/container";
import { T_Error, T_ErrorView } from "./errorTypes";
import { Text } from "@ui/text";
import { StatusLayout } from "../statusLayout";
import { statusPageBodyText, statusPageButton, statusPageContainer } from "~/styles";
import { Button } from "@ui/button";
import { redirectToLogin } from "~/utils";

const FALLBACK_MESSAGES = {
    "404": { message: "Page not found", label: "Login" },
    "500": { message: "Something went wrong", label: "Login" },
    "440": { message: "Session expired", label: "Login" },
    "401": { message: "Not authorized", label: "Login" },
    "400": { message: "Bad request", label: "Login" },
};

export const ErrorHandler = ({ status, message, statusMessages }: T_Error) => {
    const code = String(status);

    // Get messages from Strapi (if available) or fallback
    const strapiMsg = statusMessages?.[code];
    const fallbackMsg = FALLBACK_MESSAGES[code as keyof typeof FALLBACK_MESSAGES];

    const displayMessage = strapiMsg?.message || fallbackMsg?.message || message;
    const buttonLabel = strapiMsg?.label || fallbackMsg?.label || "Log in";

    const handleRedirectToLogin = () => {
        const id = localStorage.getItem("applicationId") || null;
        redirectToLogin(id);
    };

    return (
        <ErrorView status={status} message={displayMessage}>
            <Button
                type="button"
                className={statusPageButton}
                label={buttonLabel}
                onClick={handleRedirectToLogin}
            />
        </ErrorView>
    );
};

export const ErrorView = ({ message, children }: T_ErrorView) => {
    return (
        <StatusLayout>
            <Container className={statusPageContainer}>
                <Text className={statusPageBodyText}>{message}</Text>
                {children}
            </Container>
        </StatusLayout>
    );
};
