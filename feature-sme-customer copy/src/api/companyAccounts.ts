import { T_CompanyAccountsApiResponse } from "../types";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

type T_CompanyDataRequest = {
    mock: boolean;
    token: string;
    gwUrl: string;
    smeId: string;
};

export async function fetchCompanyAccounts(
    data: T_CompanyDataRequest
): Promise<T_CompanyAccountsApiResponse | undefined> {
    const url = `${data.gwUrl}/api/customer/v6/smes/${data.smeId}/engagements`;
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
            logger.log("MOCK DATA - COMPANY ENGAGEMENTS");
            logger.log(response);
        }

        if (result.status === 200) {
            return response;
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error("Fetching companyAccounts failed");
    }
}
