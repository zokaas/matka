import * as VP from "@opr-finance/api-definitions";
export declare enum E_EngagementActionConstants {
    GET_ENGAGEMENT_INITIALIZEER = "FEATURE/SME_CUSTOMER_INITIALIZEER",
    GET_ENGAGEMENT_TRIGGER = "FEATURE/SME_CUSTOMER/GET_ENGAGEMENT_TRIGGER",
    GET_ENGAGEMENT_SUCCESS = "FEATURE/SME_CUSTOMER/GET_ENGAGEMENT_SUCCESS",
    GET_ENGAGEMENT_ERROR = "FEATURE/SME_CUSTOMER/GET_ENGAGEMENT_ERROR",
    SAVE_ACTIVE_SMEID_SUCCESS = "FEATURE/SME_CUSTOMER/SAVE_ACTIVE_SMEID_SUCCESS"
}
export type T_EngagementApiResponse = VP.components["schemas"]["CustomerEngagementsResponseV6"];
export type T_EngagementBusinessIndividual = VP.components["schemas"]["BusinessIndividualEngagement"];
export type T_EngagementConsumerAccount = VP.components["schemas"]["ConsumerAccountEngagement"];
export type T_EngagementConsumerApplication = VP.components["schemas"]["ConsumerApplicationEngagement"];
export type T_EngagementConsumerOrigination = VP.components["schemas"]["ConsumerOriginationEngagement"];
export type T_EngagementInitializerPayload = T_Config;
export type T_Config = {
    token: string | null;
    gwUrl: string;
    role: string;
    mock: boolean;
    reference: string;
    refType?: string;
};
export type T_EngagementReducerState = {
    engagements: Array<T_EngagementBusinessIndividual> | undefined;
    config: T_Config;
    activeSmeId: string | undefined;
};
export type T_EngagementsRequest = {
    mock: boolean;
    token: string | null;
    gwUrl: string;
    role: string;
    refType?: string;
};
export type T_EngagementsRequestActAsCustomer = T_EngagementsRequest & {
    ssn: string;
    refType?: string;
};
