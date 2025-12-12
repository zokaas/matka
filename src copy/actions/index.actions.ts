import { ActionType, createAction } from "typesafe-actions";
// import * as Yritysluotto from "@opr-finance/api-definitions-yritysluotto";
import { T_StartPagePayload, T_PrefilledApplicationData } from "../types";

export enum AppActionConstants {
    APPLICATION_PAGE_TRIGGER = "APPLICATION_PAGE_TRIGGER",
    APPLICATION_PAGE_SUCCESS = "APPLICATION_PAGE_SUCCESS",
    APPLICATION_PAGE_WITH_UUID_TRIGGER = "APPLICATION_PAGE_WITH_UUID_TRIGGER",
    APPLICATION_PAGE_WITH_UUID_SUCCESS = "APPLICATION_PAGE_WITH_UUID_SUCCESS",
    FETCH_APPLICATION_REQUEST = "FETCH_APPLICATION_REQUEST",
    FETCH_APPLICATION_SUCCESS = "FETCH_APPLICATION_SUCCESS",
    AUTHENTICATE_TRIGGER = "AUTHENTICATE_TRIGGER",
    AUTHENTICATE_SUCCESS = "AUTHENTICATE_SUCCESS",
    FRONT_PAGE_TRIGGER = "FRONT_PAGE_TRIGGER",
    LOGIN_PAGE_TRIGGER = "LOGIN_PAGE_TRIGGER",
    START_PAGE_TRIGGER = "START_PAGE_TRIGGER",
    START_PAGE_SUCCESS = "START_PAGE_SUCCESS",
    PREVIEW_PAGE_TRIGGER = "PREVIEW_PAGE_TRIGGER",
    POST_APPLICATION_DATA_TRIGGER = "POST/APPLICATION_DATA/TRIGGER",
    POST_APPLICATION_DATA_SUCCESS = "POST/APPLICATION_DATA/SUCCESS",
    POST_APPLICATION_DATA_ERROR = "POST/APPLICATION_DATA/ERROR",
    THANK_YOU_PAGE_TRIGGER = "THANK_YOU_PAGE_TRIGGER",
}

export const applicationAppActions = {
    startPageInitTrigger: createAction(AppActionConstants.START_PAGE_TRIGGER)<T_StartPagePayload>(),
    startPageInitSuccess: createAction(AppActionConstants.START_PAGE_SUCCESS)(),
    applicationPageUuidInitSuccess: createAction(
        AppActionConstants.APPLICATION_PAGE_WITH_UUID_SUCCESS
    )(),
    applicationPageTrigger: createAction(AppActionConstants.APPLICATION_PAGE_TRIGGER)(),
    applicationPageSuccess: createAction(AppActionConstants.APPLICATION_PAGE_SUCCESS)(),
    fetchApplicationRequest: createAction(AppActionConstants.FETCH_APPLICATION_REQUEST)(),
    fetchApplicationSuccess: createAction(
        AppActionConstants.FETCH_APPLICATION_SUCCESS
    )<T_PrefilledApplicationData>(),
    authenticateTrigger: createAction(AppActionConstants.AUTHENTICATE_TRIGGER)(),
    authenticateSuccess: createAction(AppActionConstants.AUTHENTICATE_SUCCESS)(),
    thankYouPageTrigger: createAction(AppActionConstants.THANK_YOU_PAGE_TRIGGER)(),
};

export type applicationAppAction = ActionType<typeof applicationAppActions>;
