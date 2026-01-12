import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { T_KycParams } from "../types/kyc";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export const saveData = async (data: T_KycParams): Promise<string | null> => {
    logger.log("saveData", data);

    const bffUrl = process.env.REACT_APP_BFF_URL;
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
