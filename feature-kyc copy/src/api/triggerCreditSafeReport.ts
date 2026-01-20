import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { T_CreditSafeRequest } from "../types";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export type T_SniResponse = {};

export async function triggerCreditSafeReport(data: T_CreditSafeRequest): Promise<string> {
    logger.log("trigger fetch CreditSafe report ", data);
    const url = `${data.gwUrl}/broker-proxy/creditSafe/${data.cid}/${data.applicationId}/${data.companyId}/${data.smeId}`;
    const method = "GET";

    const response = await fetch(url, {
        method,
        headers: {
            "content-type": "application/json",
            authorization: data.token as string,
        },
    });

    if (!response.ok) {
        logger.error("failed to trigger fetch CreditSafe report", response.status);
        throw new Error(`Broker-proxy API error: ${response.status}`);
    }
    const result = await response.json();
    logger.log("fetchCreditSafeReport", result);

    return result;
}
