import * as VP from "@opr-finance/api-definitions";

import { IncreaseLimitApplication } from "./types";

export function mapApplicationToLfpRequest(
    data: IncreaseLimitApplication
): VP.components["schemas"]["ApplicationV8PostRequest"] {
    const application: VP.components["schemas"]["ApplicationV8PostRequest"] = {
        appliedProductId: process.env.REACT_APP_PRODUCT_ID as string,
        applicationChannel: "WEB",
        applicationCategory: "TOP_UP",
        smeId: data.smeId,
        desiredAmount: parseInt(data.newCreditLimit.replace(/\s/g, "")),
        notificationEmail: data.email,
        notificationMobileNumber: data.phone,
        extras: {
            clientIP: "",
            turnover: data.monthlyIncomeGross,
            creditCheck: data.allowInspection ? "yes" : "no",
            consentGiven: data.personalInfoConsent ? "yes" : "no",
            campaignCode: data.campaignCode,
            purposeOfCredit: data.loanPurpose,
            purposeOfCreditDescription: data.loanPurposeDescription,
        },
        guarantees: [
            {
                guaranteeAmount: 1,
                guarantor: {
                    guarantorType: "INDIVIDUAL_GUARANTOR",
                    reference: data.personalID,
                    referenceType: "SSN",
                    givenName: data.givenName,
                    surname: data.surName,
                    birthDate: data.birthDate,
                    mobilePhone: data.phone,
                },
            },
        ],
    };

    return application;
}
