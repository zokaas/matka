import { sendGTMEvent, sendGaEvent } from "@opr-finance/utils";

const productName = import.meta.env.VITE_GA4_PRODUCT_NAME;
export const onPageMount = (userId: string) => {
    const onPageLoad = () => {
        // Push Data Layer event when a visitor visit a page or the page reloads.
        sendGaEvent("pageview");
        // Push Data Layer event every time a new page loads
        sendGTMEvent({
            event: "user_id",
            userId: userId,
            product: productName,
        });
    };
    // Check if the page has already loaded
    if (document.readyState === "complete") {
        onPageLoad();
    } else {
        window.addEventListener("load", onPageLoad);
        // Remove the event listener when component unmounts
        return () => window.removeEventListener("load", onPageLoad);
    }
};
