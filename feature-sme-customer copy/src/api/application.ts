import { T_ApplicationApiResponse, T_ApplicationRequest } from "../types";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export async function fetchSmeApplication(
    data: T_ApplicationRequest
): Promise<T_ApplicationApiResponse> {
    const url = `${data.gwUrl}/api/loan/v8/applications/${data.appId}`;
    const method = "GET";
    const { token, mock } = data;

    try {
        const result: Response = await fetch(url, {
            method,
            headers: {
                "content-type": "application/json",
                authorization: token as string,
            },
        });
        const response: T_ApplicationApiResponse = await result.json();

        if (mock) {
            logger.log("MOCK DATA - SME_APPLICATION");
            logger.log(response);
        }
        if (result.status === 200) {
            return response;
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error("Fetching application failed");
    }
}
