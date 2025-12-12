import { getFrendsProps } from "../utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

export const logApplicationData = async (applicationData: any) => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { apiKey, frendsUrl } = getFrendsProps();

    const data = await applicationData;
    let result;

    result = await fetch(`${frendsUrl}/v1/pipeline/applicationlog`, {
        headers: {
            "Content-Type": "application/json",
            "X-ApiKey": apiKey,
        },
        method: "POST",
        body: JSON.stringify({ ...data }),
    })
        .then((data) => {
            return data.status;
        })
        .catch((e) => {
            logger.log("application logging failed");
            return 400;
        });

    return result;
};
