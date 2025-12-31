import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import {
    T_EngagementApiResponse,
    T_EngagementsRequest,
    T_EngagementsRequestActAsCustomer,
} from "../types";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export async function fetchEngagements(
    data: T_EngagementsRequest
): Promise<T_EngagementApiResponse> {
    const apiPath = "/individual/api/customer/v6/engagements";
    const url = data.refType
        ? `${data.gwUrl}${apiPath}?refType=${data.refType}`
        : `${data.gwUrl}${apiPath}`;
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
        const response: T_EngagementApiResponse = await result.json();

        if (mock) {
            logger.log("MOCK DATA - ENGAGEMENTS");
            logger.log(response);
        }

        if (result.status === 200) {
            return response;
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error("Fetching Engagements failed");
    }
}

export async function fetchEngagementsActAsCustomer(
    data: T_EngagementsRequestActAsCustomer
): Promise<T_EngagementApiResponse> {
    const apiPath = "/individual/api/customer/v6/engagements";
    const url = `${data.gwUrl}${apiPath}?reference=${data.ssn}&refType=${data.refType}`;
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

        const response = await result.json();

        if (mock) {
            logger.log("GOT MOCK DATA:");
            logger.log(response);
        }

        if (result.status === 200) {
            return response;
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error("Fetching Engagements failed");
    }
}
