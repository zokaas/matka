// app copy/root.tsx

import React from "react";
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError,
    LinksFunction,
    LoaderFunctionArgs,
    LoaderFunction,
} from "react-router";
import { ErrorHandler } from "../components";
import tailwindStyles from "./global.css?url";
import { bodyStyles, bodyStylesThemeClass } from "./styles.css";
import { useSessionManager } from "./hooks";
import { getSession } from "./services/session/cacheSession.server";
import { T_StatusMessagesData } from "./services";
import { getStatusMessages } from "./services/api/get-status-messages.server";

const DEFAULT_THEME = "sweden-b2b-application";
const DEFAULT_BG_IMAGE = "var(--bg-image)";

// Define the loader data type
type LoaderData = {
    theme: string;
    backgroundImage: string;
    sessionId?: string;
    productId?: string;
    exp?: number;
    maxSessionRefresh: number;
    sessionRefreshCount: number;
    applicationId?: string;
    statusMessages: T_StatusMessagesData;
};

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
    const productId = params.productId ?? DEFAULT_THEME;
    const session = await getSession(request.headers?.get("Cookie"));

    // Load status messages - no auth needed
    const statusMessages = await getStatusMessages("en");

    return {
        theme: productId,
        backgroundImage: DEFAULT_BG_IMAGE,
        sessionId: session.get("sessionId") ?? undefined,
        productId: session.get("productId") ?? productId,
        exp: session.get("exp"),
        maxSessionRefresh: session.get("maxSessionRefresh") ?? 1,
        sessionRefreshCount: session.get("sessionRefreshCount") ?? 0,
        applicationId: session.get("applicationId") ?? undefined,
        statusMessages,
    } satisfies LoaderData;
};

function Document({
    children,
    theme = DEFAULT_THEME,
}: Readonly<{
    children: React.ReactNode;
    theme?: string;
}>) {
    return (
        <html lang="en" data-theme={theme}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className={`${bodyStylesThemeClass} ${bodyStyles}`}>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

function ThrowResponse({ response }: { response: Response }): never {
    throw response;
}

function SessionManagerMount() {
    const fatalResponse = useSessionManager();
    if (fatalResponse) {
        return <ThrowResponse response={fatalResponse} />;
    }
    return null;
}

function SessionManagerGate() {
    const sessionData = useLoaderData<LoaderData>();
    const hasSession = Boolean(sessionData?.sessionId);

    return hasSession ? <SessionManagerMount /> : null;
}

export default function App() {
    const initialSession = useLoaderData<LoaderData>();

    return (
        <Document theme={initialSession?.theme || DEFAULT_THEME}>
            <SessionManagerGate />
            <Outlet />
        </Document>
    );
}
export function ErrorBoundary() {
    const error = useRouteError();
    const rootData = useLoaderData<LoaderData>();

    let status = 500;
    let message = "Unknown error";

    if (isRouteErrorResponse(error)) {
        status = error.status;
        message = error.statusText || "Error";
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <Document theme={DEFAULT_THEME}>
            <ErrorHandler
                status={status}
                message={message}
                statusMessages={rootData?.statusMessages}
            />
        </Document>
    );
}