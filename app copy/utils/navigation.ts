import { MARKETING_URLS } from "../../config";
import { getPublicEnv } from "~/environment";

function getLoginRedirectUrl(applicationId: string | null) {
    const base = (getPublicEnv(import.meta.env).PUBLIC_APP_BASE_URL || "").replace(/\/$/, "");
    return `${base}/start/${encodeURIComponent(applicationId ?? "")}`;
}

function clearLocalSession() {
    if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("applicationId");
    }
}

export function redirectToLogin(applicationId: string | null): void {
    clearLocalSession();
    window.location.replace(getLoginRedirectUrl(applicationId));
}

export function redirectToMarketingPage(productCode: string = "default") {
    clearLocalSession();
    const targetUrl = MARKETING_URLS[productCode.toLowerCase()];
    if (targetUrl) window.location.assign(targetUrl);
}
