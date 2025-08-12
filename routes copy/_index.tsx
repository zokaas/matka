// _index.tsx
import { LoaderFunction, redirect } from "react-router";
import { verifySession } from "~/services/sessionProvider.server";
import { saveSession } from "~/services/sessionStorage.server";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const {
        sessionId,
        source: productId,
        kycType,
        appId: applicationId,
        name: companyName,
        orgNumber,
    } = searchParams;

    if (sessionId && productId) {
        const { status, ttl } = await verifySession(productId, sessionId);
        if (status && ttl) {
            // Save session data in the session and redirect to dynamic route
            const dataToStore = {
                sessionId,
                productId,
                kycType,
                applicationId,
                ttl,
                companyName,
                orgNumber,
            };
            const sessionCookie = await saveSession(dataToStore); // Save session data securely

            return redirect(`/${productId}/${kycType}`, {
                headers: {
                    "Set-Cookie": sessionCookie, // Set session cookie in the response headers
                },
            });
        } else {
            // Redirect to error page if session validation fails
            return redirect("/error", {
                headers: {
                    "Set-Cookie": await saveSession({}), // Clear session cookie if necessary
                },
            });
        }
    }
    // Handle invalid URL params
    return redirect("/error");
};

export default function Index() {
    return null;
}
