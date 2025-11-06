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
import { SessionProvider, useSession } from "~/context";
import { ErrorHandler } from "../components";
import tailwindStyles from "./global.css?url";
import { bodyStyles, bodyStylesThemeClass } from "./styles.css";
import { getSession } from "./services/sessionStorage.server";
import { useSessionManager } from "./hooks";

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
    serverNow: number; // epoch ms (server time)
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
    const productId = params.productId ?? DEFAULT_THEME;
    const session = await getSession(request.headers?.get("Cookie"));

    // Prefer absolute expiry from the session store if available
    const expAbsFromStore = session.get("expiresAtMs"); // stored as absolute ms
    const ttlSec = session.get("ttl"); // seconds remaining
    const serverNow = Date.now();

    let exp: number | undefined;
    if (typeof expAbsFromStore === "number" && expAbsFromStore > 0) {
        exp = expAbsFromStore;
    } else if (typeof ttlSec === "number" && ttlSec > 0) {
        exp = serverNow + ttlSec * 1000;
    }

    return {
        theme: productId,
        backgroundImage: DEFAULT_BG_IMAGE,
        sessionId: session.get("sessionId") ?? undefined,
        productId: session.get("productId") ?? undefined,
        exp,
        maxSessionRefresh: session.get("maxSessionRefresh") ?? 1,
        sessionRefreshCount: session.get("sessionRefreshCount") ?? 0,
        applicationId: session.get("applicationId") ?? undefined,
        serverNow,
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
            {/* <body className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"> */}
            {/* TODO: Move bodyStylesThemeClass to theme prop in Document when tailwind is no longer needed */}
            <body className={`${bodyStylesThemeClass} ${bodyStyles}`}>
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
    const { session } = useSession();
    // only mount manager when session is active
    return session.status === "active" ? <SessionManagerMount /> : null;
}

export default function App() {
    const initialSession = useLoaderData<LoaderData>();

    return (
        <Document theme={initialSession?.theme || DEFAULT_THEME}>
            <SessionProvider initialSession={initialSession}>
                <SessionManagerGate />
                <Outlet />
            </SessionProvider>
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
