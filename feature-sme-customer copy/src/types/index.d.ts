export { E_EngagementActionConstants } from "./engagements";
export { E_CompanyActionConstants } from "./company";
export { E_ApplicationActionConstants } from "./application";
export type { T_Config, T_EngagementApiResponse, T_EngagementBusinessIndividual, T_EngagementInitializerPayload, T_EngagementReducerState, T_EngagementsRequest, T_EngagementsRequestActAsCustomer, T_EngagementConsumerAccount, T_EngagementConsumerApplication, T_EngagementConsumerOrigination, } from "./engagements";
export type { T_BankAccountUpdatePayload, T_CompanyAccountsApiResponse, T_CompanyApiResponse, T_CompanyBoardMembersApiResponse, T_CompanyDataRequest, T_CompanyInfoUpdateRequest, T_CompanyReducerState, T_UpdateBankAccountNumberPayload, T_UpdateCompanyBoardMembersPayload, T_UpdateCompanyInfoPayload, } from "./company";
export type { T_ApplicationApiResponse, T_ApplicationInitializerPayload, T_ApplicationReducerState, T_ApplicationRequest, } from "./application";
export type { T_SmeCompanyAccounts } from "./companyAccounts";
import { T_EngagementReducerState } from "./engagements";
import { T_CompanyReducerState } from "./company";
import { T_ApplicationReducerState } from "./application";
export type T_ResponseError = {
    message: string;
};
export type T_customerReducer = {
    engagement: T_EngagementReducerState;
    companyInfo: T_CompanyReducerState;
    application: T_ApplicationReducerState;
};
export type T_FeatureCustomerReducerState = {
    customer: T_customerReducer;
};
