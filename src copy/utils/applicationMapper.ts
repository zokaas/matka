import { extractBirthdateFromSsnSwe } from "@opr-finance/utils/src/extractBirthdateFromSsn";
import { T_Application, T_ApplicationPayload } from "../types/general";
import { addCentury } from "@opr-finance/utils/src/addCentury";
import {
    T_TrackingPayload,
    buildDataTrackingPayload,
    convertStringToRoundedInteger,
} from "@opr-finance/utils";

export const applicationMapper = async (data: T_Application): Promise<T_ApplicationPayload> => {
    const parsedAmount = parseInt(data.amount.replace(/\s+/g, ""), 10);
    const numberTurnover: number = convertStringToRoundedInteger(data.turnover) ?? 0;

    data.amount = Number.isNaN(parsedAmount) ? "0" : parsedAmount.toString();
    data.applicantBirthday = extractBirthdateFromSsnSwe(data.ssn);
    data.ssn = addCentury(data.ssn);
    data.applicantName = `${data.applicantGivenName} ${data.applicantSurname}`;
    data.companyAddressZip = data.companyAddressZip.replace(/\s/g, "");
    data.turnover = numberTurnover.toString();

    const trackingData: T_TrackingPayload = await buildDataTrackingPayload();
    return { ...data, ...trackingData };
};
