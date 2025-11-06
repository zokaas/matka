import { getPublicEnv } from "~/environment";

export function useRedirectToLogin(applicationId: string | null) {
    const baseUrl = getPublicEnv(import.meta.env).PUBLIC_APP_BASE_URL;

    return () => {
        const redirectUrl = `${baseUrl}/start/${applicationId}`;
        window.location.href = redirectUrl;
    };
}
