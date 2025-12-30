import { logger } from "@opr-finance/feature-console-logger/src/consoleLogger";
import { T_ApplicationPayload, T_ApplicationSent } from "../types/general";
import { extractPartnerApplication } from "../types/partnerPayload";

export async function sendApplication(data: T_ApplicationPayload): Promise<T_ApplicationSent> {
    const result = await fetch(`${process.env.REACT_APP_FRENDS_URL}/v1/se/application`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (result.status >= 200 && result.status < 300) {
        return {
            status: true,
        };
    } else {
        return {
            status: false,
        };
    }
}

export async function sendPartnerApplication(
    data: T_ApplicationPayload
): Promise<T_ApplicationSent> {
    const partnerApplicationData = extractPartnerApplication(data);

    logger.log("payload", partnerApplicationData);

    const result = await fetch(
        `${process.env.REACT_APP_FRENDS_PARTNER_URL}/se/v1/financed/application`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-ApiKey": `${process.env.REACT_APP_API_KEY_PARTNER}`,
            },
            body: JSON.stringify(partnerApplicationData),
        }
    );
    logger.log("partner-test-result", result);
    if (result.status >= 200 && result.status < 300) {
        return {
            status: true,
        };
    } else {
        return {
            status: false,
        };
    }
}
