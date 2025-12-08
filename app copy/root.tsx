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
import { bodyStyles } from "./styles.css";
import { getThemeClass } from "@ui/themes";
import { useSessionManager } from "./hooks";
import { getSession } from "./services/session/cacheSession.server";

//TODO: change default theme to opr-theme??
const DEFAULT_THEME = "sweden-b2b-application";


type LoaderData = {
    theme: string;
    sessionId?: string;
    productId?: string;
    exp?: number;
    maxSessionRefresh: number;
    sessionRefreshCount: number;
    applicationId?: string;
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
    const productId = params.productId ?? DEFAULT_THEME;
    const session = await getSession(request.headers?.get("Cookie"));
    const exp = session.get("exp");

    return {
        theme: productId,
        sessionId: session.get("sessionId") ?? undefined,
        productId: session.get("productId") ?? productId,
        exp,
        maxSessionRefresh: session.get("maxSessionRefresh") ?? 1,
        sessionRefreshCount: session.get("sessionRefreshCount") ?? 0,
        applicationId: session.get("applicationId") ?? undefined,
    } satisfies LoaderData;
};

function Document({
    children,
    theme = DEFAULT_THEME,
}: Readonly<{
    children: React.ReactNode;
    theme?: string;
}>) {
    const themeClass = getThemeClass(theme);

    return (
        <html lang="en" data-theme={theme}>
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

// throws a Response during render
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
        <Document theme={DEFAULT_THEME}>
            <ErrorHandler status={status} message={message} data={data} />
        </Document>
    );
}
