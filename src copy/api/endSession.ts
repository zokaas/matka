import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { getBffProps } from "../utils";

export const endSession = async () => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });

    const { logoutUrl } = getBffProps();
    const id = localStorage.getItem("id") ?? "";

    try {
        const response = await fetch(`${logoutUrl}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: id,
            },
            method: "GET",
        });

        return response;
    } catch (error) {
        logger.log("Failed to logout", error);
        throw new Error("Logout failed");
    }
};
