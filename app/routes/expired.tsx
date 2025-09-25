import React from "react";
import { LoaderFunction, useLoaderData } from "react-router";
import { Container } from "@ui-components/index";
import { useRedirectToLogin } from "~/hooks";
import { endOwnSession, getSessionData } from "~/services/sessionStorage.server";

type LoaderData = {
    applicationId: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const appIdFromQuery = url.searchParams.get("appId");
    let applicationId: string | null = appIdFromQuery || null;

    if (!applicationId) {
        applicationId = await getSessionData(request, "applicationId");
    }
    try {
        await endOwnSession(request);
    } catch (err) {
        console.error("Failed to destroy session server-side:", err);
    }
    return { applicationId };
};

const expiredPage: React.FC = () => {
    const { applicationId } = useLoaderData<LoaderData>();

    const redirectToLogin = useRedirectToLogin(applicationId);
    return (
        <Container className="bg-base-100 shadow-xl p-6">
            <h2 className="text-2xl font-bold text-base-content">
                The session is expired, login again
            </h2>
            <button onClick={redirectToLogin}>Go to login page ---</button>
        </Container>
    );
};
export default expiredPage;
