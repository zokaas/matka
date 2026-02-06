import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { waitForConsentGranted } from "./consentUtils";

declare global {
    interface Window {
        gtag?: (
            command: "get",
            targetId: string,
            fieldName: "client_id" | "session_id",
            callback: (clientId: string) => void
        ) => void;
        dataLayer: ((...items: Record<string, any>[]) => number) & any[];
    }
}

const measurementId = import.meta.env.VITE_GA_TRACKING_ID;
const logger = new ConsoleLogger({ level: LOG_LEVEL });

const getCookie = (name: string): string => {
    const match = document.cookie
        .split(";")
        .map((c): [string, string] | null => {
            const [key, ...rest] = c.trim().split("=");
            if (!key || rest.length === 0) return null;
            return [key, rest.join("=")];
        })
        .find((entry): entry is [string, string] => entry !== null && entry[0] === name);

    return match ? decodeURIComponent(match[1]) : "";
};

function getFromGtag(key: "client_id" | "session_id"): Promise<string> {
    return new Promise((resolve) => {
        try {
            window.gtag?.("get", measurementId, key, (value: string | number | undefined) => {
                if (value) {
                    logger.log("got from gtag: ", key, value);
                    resolve(value.toString());
                } else {
                    // fallback to cookie
                    const cookieFallback =
                        key === "client_id"
                            ? getGaClientId("_ga") // GA client ID cookie
                            : getSessionId("_ga_" + measurementId.replace("G-", "")); // session cookie
                    resolve(cookieFallback || "");
                }
            });
        } catch {
            resolve("");
        }
    });
}

async function getAnalyticsIds(): Promise<{ gaClientId: string; gaSessionId: string }> {
    const [gaClientId, gaSessionId] = await Promise.all([
        getFromGtag("client_id"),
        getFromGtag("session_id"),
    ]);
    return { gaClientId, gaSessionId };
}

export async function getTrackingData() {
    try {
        await waitForGtagWithGTM(); // Ensure GTM + gtag loaded
        await waitForConsentGranted(); // Wait for Coockiebot analytics consent
    } catch (e) {
        logger.warn("Consent or GTM not ready:", e);
    }

    const { gaClientId, gaSessionId } = await getAnalyticsIds();
    // for testing cookieFallback
    // const gaClientId = getGaClientId("_ga");
    // const gaSessionId = getSessionId("_ga_" + measurementId.replace("G-", ""));
    return {
        subsource: getCookie(import.meta.env.VITE_SUBSOURCE_COOKIE as string),
        source: getCookie(import.meta.env.VITE_CLICKCHANNEL as string),
        redirectId: getCookie(import.meta.env.VITE_REDIRECTAPIID as string),
        gaClientId,
        gaSessionId,
    };
}

const getGaClientId = (cookieName: string): string => {
    const cookie = getCookie(cookieName);
    const match = cookie.match(/GA\d\.\d\.(\d+\.\d+)/);
    return match ? match[1] : "";
};

const getSessionId = (cookieName: string): string => {
    const cookie = getCookie(cookieName);
    const sessionMatch = cookie.match(/s(\d+)/);
    return sessionMatch ? sessionMatch[1] : "";
};

/**
 * Waits for GTM and gtag to be ready. Times out after 3 seconds.
 */
export function waitForGtagWithGTM(timeoutMs = 3000): Promise<void> {
    if (!measurementId) {
        throw new Error("GA Measurement ID is missing.");
    }

    // Already available
    if (typeof window.gtag === "function") {
        logger.log("gtag is ready");
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        let timeoutId: NodeJS.Timeout;
        const startTime = Date.now();

        function checkGtagReady() {
            if (typeof window.gtag === "function") {
                clearTimeout(timeoutId);
                resolve();
                return true;
            }
            return false;
        }

        // 1. Observe dataLayer pushes
        const originalPush = window.dataLayer?.push;
        if (originalPush && Array.isArray(window.dataLayer)) {
            window.dataLayer.push = function (...args: Record<string, any>[]): number {
                const result = originalPush.apply(window.dataLayer, args);

                if (
                    args.some(
                        (arg) =>
                            typeof arg === "object" &&
                            arg !== null &&
                            "event" in arg &&
                            (arg as any).event === "gtm.js"
                    )
                ) {
                    checkGtagReady();
                }

                return result;
            };
        }

        // 2. Fallback polling every 100ms
        const poll = setInterval(() => {
            if (checkGtagReady()) {
                clearInterval(poll);
            } else if (Date.now() - startTime > timeoutMs) {
                clearInterval(poll);
                reject(new Error("gtag not available after waiting"));
            }
        }, 100);

        // 3. Safety timeout
        timeoutId = setTimeout(() => {
            clearInterval(poll);
            reject(new Error("gtag timeout"));
        }, timeoutMs);
    });
}
