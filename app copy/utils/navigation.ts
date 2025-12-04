import { MARKETING_URLS } from "../../config";

function clearLocalSession() {
    if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
    }
}

export function redirectToLogin(applicationId: string | null) {
    const loginbaseUrl = localStorage.getItem("loginUrl") ?? "";
    const loginUrl = `${loginbaseUrl}/${applicationId ?? ""}`;
    clearLocalSession();
    window.location.replace(loginUrl);
}

export function redirectToMarketingPage(productCode: string = "default") {
    clearLocalSession();
    const targetUrl = MARKETING_URLS[productCode.toLowerCase()];
    if (targetUrl) window.location.assign(targetUrl);
}
