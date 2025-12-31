import * as VP from "@opr-finance/api-definitions";
export declare enum E_ApplicationActionConstants {
    GET_APPLICATION_INITIALIZEER = "FEATURE/SME_CUSTOMER_INITIALIZEER",
    GET_APPLICATION_TRIGGER = "FEATURE/SME_CUSTOMER/GET_APPLICATION_TRIGGER",
    GET_APPLICATION_SUCCESS = "FEATURE/SME_CUSTOMER/GET_APPLICATION_SUCCESS",
    GET_APPLICATION_ERROR = "FEATURE/SME_CUSTOMER/GET_APPLICATION_ERROR"
}
export type T_ApplicationApiResponse = VP.components["schemas"]["SMECreditApplicationResponse"];
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
