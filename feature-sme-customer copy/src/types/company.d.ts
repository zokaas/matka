import * as VP from "@opr-finance/api-definitions";
export declare enum E_CompanyActionConstants {
    GET_COMPANY_DATA_INITIALIZEER = "FEATURE/SME_COMPANY_DATA_INITIALIZEER",
    GET_COMPANY_INFO_TRIGGER = "FEATURE/SME_CUSTOMER/COMPANY_INFO_TRIGGER",
    GET_COMPANY_INFO_SUCCESS = "FEATURE/SME_CUSTOMER/COMPANY_INFO_SUCCESS",
    GET_COMPANY_INFO_ERROR = "FEATURE/SME_CUSTOMER/COMPANY_INFO_SUCCESS_ERROR",
    GET_COMPANY_ACCOUNTS_TRIGGER = "FEATURE/SME_CUSTOMER/COMPANY_ACCOUNTS_TRIGGER",
    GET_COMPANY_ACCOUNTS_SUCCESS = "FEATURE/SME_CUSTOMER/COMPANY_ACCOUNTS_SUCCESS",
    GET_COMPANY_ACCOUNTS_ERROR = "FEATURE/SME_CUSTOMER/COMPANY_ACCOUNTS_ERROR",
    GET_COMPANY_BOARD_MEMBERS_TRIGGER = "FEATURE/SME_CUSTOMER/COMPANY_BOARD_MEMBERS_TRIGGER",
    GET_COMPANY_BOARD_MEMBERS_SUCCESS = "FEATURE/SME_CUSTOMER/COMPANY_BOARD_MEMBERS_SUCCESS",
    UPDATE_COMPANY_INFO_TRIGGER = "FEATURE/SME_CUSTOMER/UPDATE_COMPANY_INFO_TRIGGER",
    UPDATE_COMPANY_INFO_SUCCESS = "FEATURE/SME_CUSTOMER/UPDATE_COMPANY_INFO_SUCCESS",
    UPDATE_BANK_ACCOUNT_NUMBER_TRIGGER = "FEATURE/SME_CUSTOMER/UPDATE_BANK_ACCOUNT_NUMBER_TRIGGER",
    UPDATE_BANK_ACCOUNT_NUMBER_SUCCESS = "FEATURE/SME_CUSTOMER/UPDATE_BANK_ACCOUNT_NUMBER_SUCCESS",
    UPDATE_COMPANY_BOARD_MEMBERS_TRIGGER = "FEATURE/SME_CUSTOMER/UPDATE_COMPANY_BOARD_MEMBERS_TRIGGER",
    UPDATE_COMPANY_BOARD_MEMBERS_SUCCESS = "FEATURE/SME_CUSTOMER/UPDATE_COMPANY_BOARD_MEMBERS_SUCCESS",
    GET_COMPANY_BOARD_MEMBERS_ERROR = "FEATURE/SME_CUSTOMER/COMPANY_BOARD_MEMBERS_ERROR"
}
export type T_CompanyApiResponse = VP.components["schemas"]["BusinessCustomerResponseV2"];
export type T_CompanyAccountsApiResponse = VP.components["schemas"]["BusinessCustomerEngagementV6"];
export type T_CompanyBoardMembersApiResponse = VP.components["schemas"]["BoardMemberV6"];
export type T_CompanyDataInitializerPayload = T_Config;
export type T_Config = {
    token: string | null;
    gwUrl: string;
    mock: boolean;
};
export type T_CompanyReducerState = {
    config: T_Config;
    info: T_CompanyApiResponse | undefined;
    accounts: T_CompanyAccountsApiResponse | undefined;
    boardmembers: Array<T_CompanyBoardMembersApiResponse> | undefined;
};
export type T_UpdateCompanyInfoPayload = {
    email: string | undefined;
    phone: string | undefined;
    streetAddress: string | undefined;
    zipCode: string | undefined;
    city: string | undefined;
    smeId: string | undefined;
};
type T_VpBankAccountNumber = VP.components["schemas"]["DisbursementAccountV1"]["type"];
export type T_UpdateBankAccountNumberPayload = {
    number: string | undefined;
    accountId: string | undefined;
    type: T_VpBankAccountNumber;
};
export type T_UpdateCompanyBoardMembersPayload = {
    bankAccount: string | undefined;
    email: string | undefined;
    phone: string | undefined;
    streetAddress: string | undefined;
    zipCode: string | undefined;
    city: string | undefined;
};
export type T_CompanyDataRequest = {
    mock: boolean;
    token: string;
    gwUrl: string;
    smeId: string;
};
export type T_CompanyInfoUpdateRequest = {
    phone: string;
    email: string;
    streetAddress: string;
    zipCode: string;
    city: string;
    smeId: string;
    token: string;
    gwUrl: string;
};
export type T_BankAccountUpdatePayload = {
    type: T_VpBankAccountNumber;
    number: string;
    accountId: string;
    token: string;
    gwUrl: string;
    currentAccount?: string;
};
export {};
