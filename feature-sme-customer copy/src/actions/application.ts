import { createAction, ActionType } from "typesafe-actions";

import {
    E_ApplicationActionConstants,
    T_ApplicationApiResponse,
    T_ApplicationInitializerPayload,
} from "../types";
import { T_ResponseError } from "../types";

export const applicationActions = {
    applicationInitializer: createAction(
        E_ApplicationActionConstants.GET_APPLICATION_INITIALIZEER
    )<T_ApplicationInitializerPayload>(),
    applicationTrigger: createAction(E_ApplicationActionConstants.GET_APPLICATION_TRIGGER)(),
    applicationSuccess: createAction(
        E_ApplicationActionConstants.GET_APPLICATION_SUCCESS
    )<T_ApplicationApiResponse>(),
    applicationError: createAction(
        E_ApplicationActionConstants.GET_APPLICATION_ERROR
    )<T_ResponseError>(),
};

export type ApplicationAction = ActionType<typeof applicationActions>;
