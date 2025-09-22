import { getPublicEnv } from "~/environment";

export function useRedirectToLogin(applicationId: string | null) {
    const baseUrl = getPublicEnv(import.meta.env).PUBLIC_APP_BASE_URL;

    return () => {
        if (!applicationId) {
            console.error("Application ID is missing — cannot redirect to login");
            return;
        }
        const redirectUrl = `${baseUrl}/start/${applicationId}`;
        window.location.href = redirectUrl;
    };
}
