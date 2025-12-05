// app/root.tsx
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
    LoaderFunction,
    LoaderFunctionArgs,
} from "react-router";
import { ErrorHandler } from "../components";
import { useSessionManager } from "./hooks";
import { getSession } from "./services/session/cacheSession.server";
import { T_StatusMessagesData } from "./services";
import { getStatusMessages } from "./services/api/get-status-messages.server";

// Theme system imports
import {
    getThemeMetadata,
    getThemeClass,
} from "@ui/themes";

// App-level styles (vanilla-extract)
import { appRootStyle } from "./styles.css";

const DEFAULT_THEME_ID = "sweden-b2b-application";

type LoaderData = {
    theme: string;
    themeClassName: string;
    fontUrl?: string;
    logoUrl: string;
    sessionId?: string;
    productId?: string;
    exp?: number;
    maxSessionRefresh: number;
    sessionRefreshCount: number;
    applicationId?: string;
    statusMessages: T_StatusMessagesData;
};

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers?.get("Cookie"));

    // 1) Derive theme ID in one place (session → URL → default)
    const urlProductId = params.productId ?? DEFAULT_THEME_ID;
    const sessionProductId = session.get("productId") as string | undefined;
    const themeId = sessionProductId ?? urlProductId;

    // 2) Get theme metadata and class for that single themeId
    const themeMetadata = getThemeMetadata(themeId);
    const themeClassName = getThemeClass(themeId);

    // 3) Load status messages
    const statusMessages = await getStatusMessages("en");

    return {
        theme: themeId,
        themeClassName,
        fontUrl: themeMetadata.fontUrl,
        logoUrl: themeMetadata.logoUrl,
        sessionId: session.get("sessionId") ?? undefined,
        productId: themeId, // keep these in sync with theme
        exp: session.get("exp"),
        maxSessionRefresh: session.get("maxSessionRefresh") ?? 1,
        sessionRefreshCount: session.get("sessionRefreshCount") ?? 0,
        applicationId: session.get("applicationId") ?? undefined,
        statusMessages,
    } satisfies LoaderData;
};

function Document({
    children,
    themeClassName,
    fontUrl,
}: Readonly<{
    children: React.ReactNode;
    themeClassName: string;
    fontUrl?: string;
}>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {fontUrl && (
                    <>
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link
                            rel="preconnect"
                            href="https://fonts.gstatic.com"
                            crossOrigin=""
                        />
                        <link href={fontUrl} rel="stylesheet" />
                    </>
                )}
                <Meta />
                <Links />
            </head>
            {/* 
              Apply BOTH:
              - themeClassName → sets CSS variables (themeVars)
              - appRootStyle   → app-level layout that uses designConstants & themeVars
            */}
            <body className={`${themeClassName} ${appRootStyle}`}>
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
    const loaderData = useLoaderData<LoaderData>();

    return (
        <Document
            themeClassName={loaderData.themeClassName}
            fontUrl={loaderData.fontUrl}
        >
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

    // Use the same theme system for fallbacks
    const fallbackThemeClassName = getThemeClass(DEFAULT_THEME_ID);
    const fallbackThemeMeta = getThemeMetadata(DEFAULT_THEME_ID);

    const themeClassName = rootData?.themeClassName ?? fallbackThemeClassName;
    const fontUrl = rootData?.fontUrl ?? fallbackThemeMeta.fontUrl;

    return (
        <Document themeClassName={themeClassName} fontUrl={fontUrl}>
            <ErrorHandler
                status={status}
                message={message}
                statusMessages={rootData?.statusMessages}
            />
        </Document>
    );
}
