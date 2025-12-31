import { T_CompanyBoardMembersApiResponse } from "../types";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

type T_CompanyDataRequest = {
    mock: boolean;
    token: string;
    gwUrl: string;
    smeId: string;
};

export async function fetchCompanyBoardMembers(
    data: T_CompanyDataRequest
): Promise<Array<T_CompanyBoardMembersApiResponse> | undefined> {
    const url = `${data.gwUrl}/api/customer/v6/smes/${data.smeId}/boardMembers`;
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

        const response: Array<T_CompanyBoardMembersApiResponse> = await result.json();

        if (mock) {
            logger.log("MOCK DATA - BOARD MEMBERS");
            logger.log(response);
        }

        if (result.status === 200) {
            return response;
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error("Fetching board members failed");
    }
}
