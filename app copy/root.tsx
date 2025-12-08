import React from "react";
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteLoaderData,
    useRouteError,
    LinksFunction,
    LoaderFunctionArgs,
    LoaderFunction,
} from "react-router";
import { ErrorHandler } from "../components";
import tailwindStyles from "./global.css?url";
import { bodyStyles } from "./styles.css";
import { getThemeClass } from "@ui/themes";
import { useSessionManager } from "./hooks";
import { getSession } from "./services/session/cacheSession.server";
import { T_StatusMessagesData } from "./services";
import { getStatusMessages } from "./services/api/get-status-messages.server";
import { getLanguageFromProductId } from "./utils";

const DEFAULT_THEME = "sweden-b2b-application";

export type LoaderData = {
    theme: string;
    sessionId?: string;
    productId?: string;
    exp?: number;
    maxSessionRefresh: number;
    sessionRefreshCount: number;
    applicationId?: string;
    statusMessages?: T_StatusMessagesData;
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];

export const handle = { id: "root" };

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers?.get("Cookie"));
    const productId = session.get("clientId") ?? DEFAULT_THEME;
    const cacheSession = session.get("session");
    const sessionId = cacheSession?.sessionId ?? undefined;
    const exp = cacheSession?.exp ?? 0;
    const maxSessionRefresh = cacheSession?.maxSessionRefresh ?? 1;
    const sessionRefreshCount = cacheSession?.sessionRefreshCount ?? 0;
    const applicationId = session.get("applicationId") ?? undefined;

    const lang = getLanguageFromProductId(productId);

    let statusMessages: T_StatusMessagesData | undefined;
    try {
        statusMessages = await getStatusMessages(lang);
    } catch (error) {
        console.error("Failed to fetch status messages:", error);
        statusMessages = undefined;
    }

    return {
        theme: productId,
        sessionId,
        productId,
        exp,
        maxSessionRefresh,
        sessionRefreshCount,
        applicationId,
        statusMessages,
    } satisfies LoaderData;
};

function Document({
    children,
    theme = DEFAULT_THEME,
    lang = "en",
}: Readonly<{
    children: React.ReactNode;
    theme?: string;
    lang?: string;
}>) {
    const themeClass = getThemeClass(theme);

    return (
        <html lang={lang} data-theme={theme}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className={`${themeClass} ${bodyStyles}`}>
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
    const derivedLang = getLanguageFromProductId(initialSession?.productId || DEFAULT_THEME);

    return (
        <Document theme={initialSession?.theme || DEFAULT_THEME} lang={derivedLang}>
            <SessionManagerGate />
            <Outlet />
        </Document>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const rootLoaderData = useRouteLoaderData<LoaderData>("root");

    const derivedLang = getLanguageFromProductId(rootLoaderData?.productId || DEFAULT_THEME);

    let status = 500;
    let message = "Unknown error";
    let data: unknown = {};

    if (isRouteErrorResponse(error)) {
        status = error.status;
        message = error.statusText || "Route Error response";
        data = error.data;
    } else if (error instanceof Error) {
        message = error.message || "Application error";
        data = { stack: error.stack };
    } else {
        data = { raw: error };
    }

    return (
        <Document theme={DEFAULT_THEME} lang={derivedLang}>
            <ErrorHandler
                status={status}
                message={message}
                data={data}
                statusMessages={rootLoaderData?.statusMessages}
            />
        </Document>
    );
}
