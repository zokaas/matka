import { T_CompanyAccountsApiResponse } from "../types";
type T_CompanyDataRequest = {
    mock: boolean;
    token: string;
    gwUrl: string;
    smeId: string;
};
export declare function fetchCompanyAccounts(data: T_CompanyDataRequest): Promise<T_CompanyAccountsApiResponse | undefined>;
export {};
