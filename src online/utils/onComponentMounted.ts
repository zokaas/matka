import { sendGAEvent, sendUserIdEvent } from "@opr-finance/utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

export const onComponentMounted = (boardMemberId: string) => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const onPageLoad = () => {
        //if (!authenticated && !boardMemberId) {
        logger.log("PUSH user_id, pageview");
        // Push Data Layer event every time a new page loads
        sendUserIdEvent(boardMemberId);
        // Push Data Layer event when a visitor visit a page or the page reloads.
        sendGAEvent({ event: "pageview" });
        //}
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
