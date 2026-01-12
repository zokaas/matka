import { ActionType, createAction } from "typesafe-actions";

export enum AppActionConstants {
    FI_PIPELINE_TRIGGER = "APP/FI_TRIGGER",
}

export const appActions = {
    finnishPipelineTrigger: createAction(AppActionConstants.FI_PIPELINE_TRIGGER)(),
};

export type AppAction = ActionType<typeof appActions>;
