import { T_EngagementApiResponse, T_EngagementsRequest, T_EngagementsRequestActAsCustomer } from "../types";
export declare function fetchEngagements(data: T_EngagementsRequest): Promise<T_EngagementApiResponse>;
export declare function fetchEngagementsActAsCustomer(data: T_EngagementsRequestActAsCustomer): Promise<T_EngagementApiResponse>;
