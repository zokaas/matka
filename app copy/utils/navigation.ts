import { useRedirectToLogin } from "~/hooks";
import { MARKETING_URLS } from "../../config";

export function redirectToMarketingPage(productCode: string = "default") {
    const targetUrl = MARKETING_URLS[productCode.toLowerCase()];

    if (!targetUrl) {
        console.warn(`No marketing URL found for product code "${productCode}".`);
        return;
    }

    if (typeof window !== "undefined") {
        window.location.assign(targetUrl);
    } else {
        console.warn("redirectToMarketingPage called in non-browser environment");
    }
}

/**
 * Handles "not found" or unknown error:
 * - Clears local and backend session
 * - Redirects to login page OR
 * - Redirects to product-specific marketing page
 */
export async function handleNotFoundRedirect(
    applicationId: string | null,
    productId: string = "default"
) {
    try {
        if (typeof window !== "undefined") {
            try {
                await fetch("/end-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                console.log("session destroyed");
            } catch (err) {
                console.warn("Failed to notify server about session end:", err);
            }
        }
        if (applicationId) useRedirectToLogin(applicationId);
        else redirectToMarketingPage(productId);
    } catch (err) {
        console.error("handleNotFoundRedirect failed:", err);
        // fallback redirect
        redirectToMarketingPage("default");
    }
}
