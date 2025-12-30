import { ActionType, createAction } from "typesafe-actions";

export enum AppActionConstants {
    SE_PIPELINE_TRIGGER = "APP/SE_TRIGGER",
}

export const appActions = {
    swedishPipelineTrigger: createAction(AppActionConstants.SE_PIPELINE_TRIGGER)(),
};

export type AppAction = ActionType<typeof appActions>;
