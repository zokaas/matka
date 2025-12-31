import * as VP from "@opr-finance/api-definitions";

import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import {
    T_BankAccountUpdatePayload,
    T_CompanyApiResponse,
    T_CompanyDataRequest,
    T_CompanyInfoUpdateRequest,
} from "../types";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export async function fetchCompanyData(
    data: T_CompanyDataRequest
): Promise<T_CompanyApiResponse | undefined> {
    const url = `${data.gwUrl}/api/customer/v6/smes/${data.smeId}`;
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
            logger.log("MOCK DATA - COMPANY DATA");
            logger.log(response);
        }

        if (result.status === 200) {
            return response;
        } else {
            throw new Error();
        }
    } catch (error) {
        throw new Error("Fetching company-info failed");
    }
}

export async function updateCompanyInfo(
    data: T_CompanyInfoUpdateRequest
): Promise<VP.components["schemas"]["BusinessCustomerResponseV2"] | undefined> {
    try {
        const url = `${data.gwUrl}/update/profile/api/customer/v6/smes/${data.smeId}`;
        const method = "PATCH";
        const { token, phone, email, streetAddress, zipCode, city } = data;
        const bodyData: VP.components["schemas"]["BusinessCustomerUpdateV2"] = {
            phone,
            email,
            officialAddress: {
                streetAddress,
                zipCode,
                city,
            },
        };

        const result = await fetch(url, {
            method,
            headers: {
                "content-type": "application/json",
                authorization: token as string,
            },
            body: JSON.stringify(bodyData),
        });
        if (result.status === 200) {
            return result.json() as Promise<VP.components["schemas"]["BusinessCustomerResponseV2"]>;
        }
    } catch (error) {
        throw new Error("Error fetching update profile request:" + error);
    }
}
//DisbursementAccountForSME
export async function updateOrCreateBankAccountNumber(
    data: T_BankAccountUpdatePayload
): Promise<VP.components["schemas"]["DisbursementAccountV1"] | undefined> {
    try {
        const currentAccount = data.currentAccount?.toString() ?? "";
        const isCreate = !currentAccount || currentAccount === "";

        const baseUrl = `/api/loan/v8/accounts/${data.accountId}/disbursementAccount`;
        const url = `${data.gwUrl}/${isCreate ? "create" : "update"}/bankaccount${baseUrl}`;
        const method = isCreate ? "POST" : "PUT";

        const { token, type, number } = data;
        const bodyData: VP.components["schemas"]["DisbursementAccountV1"] = {
            type,
            number,
        };

        const result = await fetch(url, {
            method,
            headers: {
                "content-type": "application/json",
                authorization: token as string,
            },
            body: JSON.stringify(bodyData),
        });

        if (result.status === 200 || result.status === 201) {
            return result.json() as Promise<VP.components["schemas"]["DisbursementAccountV1"]>;
        }
    } catch (error) {
        throw new Error("Updating bank account number failed:" + error);
    }
}
