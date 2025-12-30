import * as VP from "@opr-finance/api-definitions";
import { httpFaker } from "@opr-finance/utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { T_GatewayProps } from "@opr-finance/utils/src/types/general";
import { getGwProps } from "@opr-finance/utils/src/getGwProps";

export enum SendIncreaseLimitApplicationResult {
    Default = "",
    Error = "Error",
    BankAccountError = "BankAccountError",
    Approved = "APPROVED",
    Referral = "REFERRAL",
    Rejected = "REJECTED",
    Unprocessed = "UNPROCESSED",
}

type T_StatusCode = {
    status: number;
};
const { mock, fullVpApiUrl }: T_GatewayProps = getGwProps();

export async function sendTopupApplication(
    data: VP.components["schemas"]["ApplicationV8PostRequest"]
) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const url = `${fullVpApiUrl}/topup/api/loan/v8/applications`;
    const token = localStorage.getItem("token");
    if (mock) {
        logger.log("got application: ", data);
        const method = "POST";

        /* const getRandomStatusCode = () => {
            return Math.random() < 0.5 ? 200 : 400;
        }; */

        return httpFaker<null, VP.components["schemas"]["ApplicationV8Response"] & T_StatusCode>(
            url,
            method,
            null,
            {
                status: 200,
                applicationChannel: "PHONE",
                applicationState: "PN_CREATED",
                appliedProductId: "1234567",
                smeId: "string",
                externalReference: "x-1234567",
                desiredAmount: 12345,
                desiredPaybackTime: 36,
                loanReason: "EXPANSION",
                loanReasonText: "To improve our cashflow",
                notificationEmail: "mats.nordgren@viljasolutions.com",
                notificationMobileNumber: "+46768494344",
                downgradeAccepted: true,
                preferredDueDay: 15,
                applicationComments: ["string"],
                approvedAmount: 12345,
                approvedPaybackTime: 24,
                decisionComment:
                    "This application is rejected because we belive the paper industry is doomed",
                riskClass: "NORMAL",
                riskClassComment: "This company is harmless",
                preferredDisbursementAccount: {
                    type: "SE-CLEARING",
                    number: "string",
                },
                startupFee: 0,
                serviceFee: 0,
                statementChannel: "PAPER",
                statusUpdateDate: "2021-11-15",
                assignedUser: "string",
                actualDecision: "APPROVED",
                suggestion: "APPROVED",
                rejectReasonCode: "1",
                rejectReasonText: "string",
                extras: {
                    additionalProp1: "string",
                    additionalProp2: "string",
                    additionalProp3: "string",
                },
                credits: [
                    {
                        sum: 0,
                        rate: 0,
                        paybackTime: 0,
                        bank: "string",
                        monthlyCost: 0,
                        typeOfCredit: "string",
                        externalLoanAccountNumber: "string",
                        validForCollateral: true,
                        amortization: 0,
                    },
                ],
                agreementSignatories: [
                    {
                        documentType: "PROMISSORY_NOTE",
                        signatoryPersons: [
                            {
                                name: "Frida Kranstego",
                                reference: "197705232382",
                            },
                        ],
                    },
                ],
                brokerName: "string",
                applicationCategory: "NEW",
                guarantees: [
                    {
                        guaranteeAmount: 0,
                        guarantor: {
                            guarantorType: "INDIVIDUAL_GUARANTOR",
                            reference: "193504049135",
                            referenceType: "SSN",
                            givenName: "string",
                            preferredName: "string",
                            surname: "string",
                            birthDate: "string",
                            nationality: "string",
                            selfAssessedPEP: "NULL",
                            selfAssessedPepDescription: "string",
                            externalPepStatus: "PEP",
                            address: {
                                streetAddress: "string",
                                supplementaryStreetAddress: "string",
                                region: "string",
                                zipCode: "string",
                                city: "string",
                                country: "string",
                                coAddress: "string",
                                apartmentNumber: "string",
                                propertyNumber: "string",
                                buildingName: "string",
                                floorNumber: "string",
                                complementingInformation: "string",
                            },
                            email: "info@viljasolutions.com",
                            phone: "+468123456",
                            mobilePhone: "+468123456",
                        },
                    },
                ],
            }
        );
    }

    const result = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json",
            authorization: token as string,
        },
    });
    return result;
}
