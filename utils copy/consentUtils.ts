/**
 * Waits for Cookiebot to grant analytics consent.
 * Resolves immediately if consent is already granted.
 * Otherwise waits until user grants consent or timeout is reached.
 */

declare global {
    interface Window {
        Cookiebot?: {
            consent: {
                method: string;
                necessary: boolean;
                preferences: boolean;
                statistics: boolean;
                marketing: boolean;
                stamp: string;
            };
        };
    }
}

export function waitForConsentGranted(timeoutMs = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
        const consentGranted = (): boolean => {
            return (
                typeof window.Cookiebot !== "undefined" &&
                window.Cookiebot.consent?.statistics === true
            );
        };

        if (consentGranted()) {
            resolve();
            return;
        }

        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("Consent not granted in time"));
        }, timeoutMs);

        const handler = () => {
            if (consentGranted()) {
                cleanup();
                resolve();
            }
        };

        const cleanup = () => {
            clearTimeout(timeout);
            window.removeEventListener("CookieConsentDeclaration", handler);
        };

        window.addEventListener("CookieConsentDeclaration", handler);
    });
}
