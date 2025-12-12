import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";
import { T_PrePageFields } from "../pages/PrePage/prePage.types";

export const saveBasicInfo = async (fields: T_PrePageFields) => {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const bffUrl = import.meta.env.VITE_BFF_URL;
    const data = {
        amount: Number(fields.loanAmount),
        businessId: fields.organizationNumber,
        email: fields.emailAddress,
        maturity: Number(fields.repaymentPeriod.replace(" månader", "")),
        phoneNumber: fields.applicantPhone,
        source: "own_channel",
    };
    const result = await fetch(`${bffUrl}/foretagslan/save-basicInfo`, {
        headers: {
            "Content-Type": "application/json",
            authentication: "",
        },
        method: "POST",
        body: JSON.stringify(data),
    }).then((data) => data.json());

    if (result.status === 201) {
        logger.log("Basic data saved");
        return result.data.applicationUuid;
    } else {
        logger.log("Failed to save data", result);
    }
};
