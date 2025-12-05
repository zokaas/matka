import React from "react";
import { Container } from "@ui/container";
import { T_Error, T_ErrorView } from "./errorTypes";
import { Text } from "@ui/text";
import { StatusLayout } from "../statusLayout";
import {
    statusPageBodyText,
    statusPageButton,
    statusPageContainer,
    statusPageHeader,
} from "~/styles";
import { Button } from "@ui/button";
import { redirectToLogin } from "~/utils";

export const ErrorHandler = ({ status, message, data }: T_Error) => {
    /**
     * Error handler
     * - send error data for debugging
     * - redirect to login page
     */
    //TODO: send to logger service if needed
    console.log("ErrorHandler", status, message, data);

    const t = {
        errors: {
            "404": {
                message: "Page not found",
                label: "Login",
            },
            "500": {
                message: "Something went wrong on our side",
                label: "Login",
            },
            "440": {
                message: "Session expired, should login again",
                label: "Login",
            },
            "401": {
                message: "Not authorized, should login again ",
                label: "Login",
            },
            "400": {
                message: "Bad request",
                label: "Login",
            },
        },
    };
    const translatedMessage: string =
        t.errors[String(status) as keyof typeof t.errors].message || message;
    const buttonLabel: string = t.errors[String(status) as keyof typeof t.errors].label;

    const handleRedirectToLogin = () => {
        const id = localStorage.getItem("applicationId") || null;
        redirectToLogin(id);
    };

    const actionButton = (() => {
        const commonProps = {
            type: "button" as const,
            className: statusPageButton,
            label: buttonLabel,
        };
        return <Button {...commonProps} onClick={handleRedirectToLogin} />;
    })();

    return (
        <ErrorView status={status} message={translatedMessage}>
            {actionButton}
        </ErrorView>
    );
};

//TODO status left for testing, remove it
export const ErrorView = ({ status, message, children }: T_ErrorView) => {
    return (
        <StatusLayout>
            <Container className={statusPageContainer}>
                <Text className={statusPageHeader}>Error:</Text>
                {status && <Text className={statusPageBodyText}>status: {status}</Text>}
                <Text className={statusPageBodyText}>message: {message}</Text>
                {children}
            </Container>
        </StatusLayout>
    );
};
