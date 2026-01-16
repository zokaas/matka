import * as VP from "@opr-finance/api-definitions";
import { T_CompanyAccountsApiResponse } from "./company";
export declare enum E_ApplicationActionConstants {
    GET_APPLICATION_INITIALIZEER = "FEATURE/SME_CUSTOMER_INITIALIZEER",
    GET_APPLICATION_TRIGGER = "FEATURE/SME_CUSTOMER/GET_APPLICATION_TRIGGER",
    GET_APPLICATION_SUCCESS = "FEATURE/SME_CUSTOMER/GET_APPLICATION_SUCCESS",
    GET_APPLICATION_ERROR = "FEATURE/SME_CUSTOMER/GET_APPLICATION_ERROR"
}
export type T_ApplicationApiResponse = VP.components["schemas"]["SMECreditApplicationResponse"] & {
    dynamicFields: T_ApplicationDynamicFields;
};
export type T_Config = {
    token: string | null;
    gwUrl: string;
    mock: boolean;
};
export type T_ApplicationInitializerPayload = T_Config;
export type T_ApplicationReducerState = {
    application: T_ApplicationApiResponse | undefined;
    config: T_Config;
};
export type T_ApplicationRequest = {
    mock: boolean;
    token: string | null;
    gwUrl: string;
    appId: string;
};
export type T_IndividualGuarantor = VP.components["schemas"]["IndividualGuarantorV8Response"];
type T_BusinessGuarantor = VP.components["schemas"]["BusinessGuarantorV8Response"];
export type T_Guarantor = T_IndividualGuarantor | T_BusinessGuarantor;
export type T_ApplicationDynamicFields = {
    kyc: {
        kycDone: boolean;
        kycUpdatedDate: string;
        riskScore: string;
        riskClassification: string;
        industryCode: string;
        redirectUrl: string;
    };
};
export type T_ExistingCustomerApplications = T_CompanyAccountsApiResponse["applications"];
export type T_ExistingCustomerApplication = NonNullable<T_CompanyAccountsApiResponse["applications"]>[number] & {
    dynamicFields?: T_ApplicationDynamicFields;
};
export {};
