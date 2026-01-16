import { ActionType } from "typesafe-actions";
import { E_ApplicationActionConstants, T_ApplicationApiResponse } from "../types";
import { T_ResponseError } from "../types";
export declare const applicationActions: {
    applicationInitializer: import("typesafe-actions").PayloadActionCreator<E_ApplicationActionConstants.GET_APPLICATION_INITIALIZEER, import("../types/application").T_Config>;
    applicationTrigger: import("typesafe-actions").EmptyActionCreator<E_ApplicationActionConstants.GET_APPLICATION_TRIGGER>;
    applicationSuccess: import("typesafe-actions").PayloadActionCreator<E_ApplicationActionConstants.GET_APPLICATION_SUCCESS, T_ApplicationApiResponse>;
    applicationError: import("typesafe-actions").PayloadActionCreator<E_ApplicationActionConstants.GET_APPLICATION_ERROR, T_ResponseError>;
};
export type ApplicationAction = ActionType<typeof applicationActions>;
