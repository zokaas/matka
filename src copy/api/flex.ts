import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { T_Application, T_ApplicationSent } from "../types/general";
import { T_BrokerProxyApplication } from "../types/partner";
import { T_TrackingPayload } from "@opr-finance/utils";
import { BrokerName } from "./brokerConfig";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

async function postToBff(url: string, data: unknown): Promise<boolean> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error("Request failed:", error);
        return false;
    }
}

export async function sendApplication(
    data: T_Application & T_TrackingPayload
): Promise<T_ApplicationSent> {
    const status = await postToBff(
        `${process.env.REACT_APP_BFF_URL}/company-loan-flex/fi/application`,
        data
    );
    return { status, type: "general" };
}

export function sendBrokerApplication(brokerName: BrokerName) {
    return async (
        data: T_BrokerProxyApplication & T_TrackingPayload
    ): Promise<T_ApplicationSent> => {
        const status = await postToBff(
            `${process.env.REACT_APP_BFF_URL}/company-loan-flex/fi/broker/${brokerName}`,
            data
        );
        return { status, type: "general", partner: true };
    };
}
//TODO: move this to go through bff aswell?
export async function sendRescoringApplication(
    data: T_Application & T_TrackingPayload
): Promise<T_ApplicationSent> {
    const result = await fetch(`${process.env.REACT_APP_FRENDS_URL}/v1/fi/increase-credit-limit`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (result.status >= 200 && result.status < 300) {
        return {
            status: true,
            type: "rescoring",
        };
    } else {
        return {
            status: false,
            type: "rescoring",
        };
    }
}
