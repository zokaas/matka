import { createCookieSessionStorage } from "react-router";
import { T_DataToStore } from "~/types/session";
import { T_CompanyDataFromSession } from "./api";

// Create session storage
const sessionSecret = "secret"; // TODO use env

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "_session",
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        secrets: [sessionSecret], // Encrypt the session data
        sameSite: "lax", // Protect against CSRF
        path: "/",
        httpOnly: true,
    },
});

// Save session ID in the session
export const saveSession = async (data: T_DataToStore) => {
    const session = await getSession();
    Object.entries(data).forEach(([key, value]) => {
        session.set(key, value);
    });
    return commitSession(session); // Return the cookie header to set it in the response
};

// Get data from session
export const getSessionData = async (request: Request, dataKey: string) => {
    const session = await getSession(request.headers.get("Cookie"));
    return session.get(dataKey);
};

export const getOrganizationFromSession = async (
    request: Request
): Promise<T_CompanyDataFromSession> => {
    const session = await getSession(request.headers.get("Cookie"));

    const sessionId = session.get("sessionId");
    const companyName = session.get("companyName");
    const orgNumber = session.get("orgNumber");

    return {
        sessionId,
        companyName,
        orgNumber,
    };
};

// Destroy the session (for logout or session expiry)
export const endOwnSession = async (request: Request) => {
    const session = await getSession(request.headers.get("Cookie"));
    return destroySession(session); // Return the cookie header to delete it
};
