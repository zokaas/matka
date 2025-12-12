import { T_ApplicationData } from "../types";
import { getFrendsProps } from "../utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

export const sendApplication = async (applicationData: T_ApplicationData) => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { apiKey, frendsUrl } = getFrendsProps();

    try {
        const response = await fetch(`${frendsUrl}/v1/pipeline/application`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-ApiKey": apiKey,
            },
            body: JSON.stringify(applicationData),
        });

        logger.log(response.status);
        return response.status;
    } catch (error) {
        logger.log("application sending failed", error);
        return 400;
    }
};
