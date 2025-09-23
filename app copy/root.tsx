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
import { SessionProvider } from "~/context/SessionContext";
import Error from "../components/Error/Error";
import tailwindStyles from "./global.css?url";
import { bodyStyles, bodyStylesThemeClass } from "./styles.css";
import { getSession } from "./services/sessionStorage.server";

const DEFAULT_THEME = "sweden-b2b-application";
const DEFAULT_BG_IMAGE = "var(--bg-image)";

// Define the loader data type
type LoaderData = {
    theme: string;
    backgroundImage: string;
    sessionId: string;
    productId: string;
    exp: number;
    maxSessionRefresh: number;
    sessionRefreshCount: number;
    applicationId: string;
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindStyles }];

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
    const productId = params.productId ?? DEFAULT_THEME;
    const session = await getSession(request.headers?.get("Cookie"));
    const now = Date.now();
    const expiresAt = session.get("ttl") * 1000 + now;
    return {
        theme: productId,
        backgroundImage: DEFAULT_BG_IMAGE,
        sessionId: session.get("sessionId"),
        productId: session.get("productId"),
        exp: expiresAt,
        maxSessionRefresh: session.get("maxSessionRefresh"),
        sessionRefreshCount: session.get("sessionRefreshCount"),
        applicationId: session.get("applicationId"),
    };
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

export default function App() {
    const initialSession = useLoaderData<LoaderData>();

    return (
        <Document theme={initialSession?.theme || DEFAULT_THEME}>
            <SessionProvider initialSession={initialSession}>
                <Outlet />
            </SessionProvider>
        </Document>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const message = isRouteErrorResponse(error)
        ? error.data
        : "Something went wrong. Please try again later.";

    return (
        <Document theme={DEFAULT_THEME}>
            <Error title="An error occurred!">
                <p className="text-xl my-5">{message}</p>
            </Error>
        </Document>
    );
}
