import { T_CompanyBoardMembersApiResponse } from "../types";
type T_CompanyDataRequest = {
    mock: boolean;
    token: string;
    gwUrl: string;
    smeId: string;
};
export declare function fetchCompanyBoardMembers(data: T_CompanyDataRequest): Promise<Array<T_CompanyBoardMembersApiResponse> | undefined>;
export {};
