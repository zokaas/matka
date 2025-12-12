import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { T_KycParams } from "../types";

export const saveData = async (data: T_KycParams): Promise<string | null> => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    logger.log("saveData", data);
    const bffUrl = import.meta.env.VITE_BFF_URL;
    try {
        const response = await fetch(`${bffUrl}/cache/session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        logger.log(response.status);
        const result = await response.json();
        return result.redisKey;
    } catch (error) {
        logger.log("data caching failed", error);
        return null;
    }
};
