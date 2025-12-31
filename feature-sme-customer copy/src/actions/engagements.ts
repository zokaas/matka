import { createAction, ActionType } from "typesafe-actions";

import {
    E_EngagementActionConstants,
    T_EngagementBusinessIndividual,
    T_EngagementInitializerPayload,
} from "../types";
import { T_ResponseError } from "../types";

export const engagementActions = {
    engagementInitializer: createAction(
        E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER
    )<T_EngagementInitializerPayload>(),
    engagementTrigger: createAction(E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER)(),
    engagementSuccess: createAction(E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS)<
        Array<T_EngagementBusinessIndividual>
    >(),
    engagementError: createAction(
        E_EngagementActionConstants.GET_ENGAGEMENT_ERROR
    )<T_ResponseError>(),
    saveSmeIdSuccess: createAction(E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS)<string>(),
};

export type EngagementAction = ActionType<typeof engagementActions>;
