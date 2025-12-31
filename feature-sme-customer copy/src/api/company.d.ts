import * as VP from "@opr-finance/api-definitions";
import { T_BankAccountUpdatePayload, T_CompanyApiResponse, T_CompanyDataRequest, T_CompanyInfoUpdateRequest } from "../types";
export declare function fetchCompanyData(data: T_CompanyDataRequest): Promise<T_CompanyApiResponse | undefined>;
export declare function updateCompanyInfo(data: T_CompanyInfoUpdateRequest): Promise<VP.components["schemas"]["BusinessCustomerResponseV2"] | undefined>;
export declare function updateOrCreateBankAccountNumber(data: T_BankAccountUpdatePayload): Promise<VP.components["schemas"]["DisbursementAccountV1"] | undefined>;
