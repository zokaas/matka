import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { T_PrefilledApplicationData } from "../types";
import { getFrendsProps, cleanLocalStorage } from "../utils";
import { E_Routes } from "../types"; // Adjust the path as needed

export const getApplication = async (): Promise<T_PrefilledApplicationData | null> => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { apiKey, frendsUrl } = getFrendsProps();

    const uuid = localStorage.getItem("applicationUuid");
    const applicationUuid = uuid ?? "";

    const response = await fetch(`${frendsUrl}/v1/front-page/application/${applicationUuid}`, {
        method: "GET",
        headers: {
            "X-ApiKey": apiKey,
            accept: "application/json",
        },
    });
    if (response.status !== 200) {
        logger.log("Failed to get application with id:", applicationUuid);
        cleanLocalStorage();
        window.location.href = E_Routes.ERROR;
    }

    const data = await response.json();
    return data;
};
