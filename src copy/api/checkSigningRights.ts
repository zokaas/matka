import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { getFrendsProps } from "../utils";
import { T_CheckRightsProps, T_SigningRightsResult } from "./types";

export const checkSigningRights = async (props: T_CheckRightsProps): Promise<boolean> => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });

    const { ssn, organizationNumber } = props;
    const { apiKey, frendsUrl } = getFrendsProps();

    const result: T_SigningRightsResult = await fetch(
        `${frendsUrl}/v1/sign-authority/ssn/${ssn}/businessid/${organizationNumber}`,
        {
            headers: {
                "Content-Type": "application/json",
                "X-ApiKey": apiKey,
            },
            method: "GET",
        }
    )
        .then((data) => {
            if (data.status !== 200) {
                logger.log("failed to fetch data");
                return null;
            }
            return data.json();
        })
        .catch((e) => logger.log(e));

    const companyInfo = {
        companyName: result.company.name,
        organizationNumber: organizationNumber,
    };
    localStorage.setItem("company-info", JSON.stringify(companyInfo));

    return result.personInCompany && result.company.status === "Active";
};
