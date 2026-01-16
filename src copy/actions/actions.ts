import { ActionType, createAction } from "typesafe-actions";
import { T_UpdateUserInfoFormData } from "../pages/UserPage/types";
import { T_KycState } from "../types/kyc";

export enum AppActionConstants {
    APPLICATION_TRIGGER = "APP/INIT_TRIGGER",
    APPLICATION_SUCCESS = "APP/INIT_SUCCESS",
    APPLICATION_PAGE_TRIGGER = "PAGE/APPLICATION_PAGE_TRIGGER",
    APPLICATION_PAGE_SUCCESS = "PAGE/APPLICATION_PAGE_SUCCESS",
    CONTACT_PAGE_TRIGGER = "PAGE/CONTACT_PAGE_TRIGGER",
    CONTACT_PAGE_SUCCESS = "PAGE/CONTACT_PAGE_SUCCESS",
    CHOOSE_ACCOUNT_PAGE_TRIGGER = "PAGE/CHOOSE_ACCOUNT_PAGE_TRIGGER",
    CHOOSE_ACCOUNT_PAGE_SELECTED = "PAGE/CHOOSE_ACCOUNT_PAGE_SELECTED",
    CHOOSE_ACCOUNT_PAGE_SUCCESS = "PAGE/CHOOSE_ACCOUNT_PAGE_SUCCESS",
    START_PAGE_TRIGGER = "PAGE/START_PAGE_TRIGGER",
    START_PAGE_SUCCESS = "PAGE/START_PAGE_SUCCESS",
    FRONT_PAGE_TRIGGER = "PAGE/FRONT_INIT_TRIGGER",
    FRONT_PAGE_SUCCESS = "PAGE/FRONT_INIT_SUCCESS",
    GET_COMPANY_DATA_SUCCESSS = "GET_COMPANY_DATA_SUCCESSS",
    GET_COMPANY_DATA_ERROR = "GET_COMPANY_DATA_SUCCESSS",
    USER_PAGE_TRIGGER = "PAGE/USER_PAGE_TRIGGER",
    USER_PAGE_SUCCESS = "PAGE/USER_PAGE_SUCCESS",
    USER_INFO_UPDATE_TRIGGER = "USER_INFO_UPDATE_TRIGGER",
    USER_INFO_UPDATE_SUCCESS = "USER_INFO_UPDATE_SUCCESS",
    LOGIN_PAGE_TRIGGER = "PAGE/LOGIN_PAGE_TRIGGER",
    LOGIN_PAGE_SUCCESS = "PAGE/LOGIN_PAGE_SUCCESS",
    LOAN_PAGE_TRIGGER = "PAGE/LOAN_PAGE_TRIGGER",
    LOAN_PAGE_SUCCESS = "PAGE/LOAN_INIT_SUCCESS",
    LOGOUT_PAGE_TRIGGER = "PAGE/LOGOUT_PAGE_TRIGGER",
    LOGOUT_PAGE_SUCCESS = "PAGE/LOGOUT_PAGE_SUCCESS",
    EXPIRED_PAGE_TRIGGER = "PAGE/EXPIRED_PAGE_TRIGGER",
    EXPIRED_PAGE_SUCCESS = "PAGE/EXPIRED_PAGE_SUCCESS",
    TOPUP_PAGE_TRIGGER = "PAGE/TOPUP_PAGE_TRIGGER",
    TOPUP_PAGE_SUCCESS = "PAGE/TOPUP_PAGE_SUCCESS",
    // TOPUP_APPLICATION_SEND_TRIGGER = "APP/TOPUP_APPLICATION_SEND_TRIGGER",
    TRANSLATION_TRIGGER = "PAGE/TRANSLATION_TRIGGER",
    TRANSLATION_SUCCESS = "PAGE/TRANSLATION_SUCCESS",
    UPDATE_KYC_STATE = "UPDATE_KYC_STATE",
}

type T_ChooseAccountPageSelectedPayload = {
    smeId: string;
};

export const appActions = {
    applicationTrigger: createAction(AppActionConstants.APPLICATION_TRIGGER)(),
    applicationSuccess: createAction(AppActionConstants.APPLICATION_SUCCESS)(),
    applicationPageTrigger: createAction(AppActionConstants.APPLICATION_PAGE_TRIGGER)(),
    applicationPageSuccess: createAction(AppActionConstants.APPLICATION_PAGE_SUCCESS)(),
    startPageTrigger: createAction(AppActionConstants.START_PAGE_TRIGGER)(),
    startPageSuccess: createAction(AppActionConstants.START_PAGE_SUCCESS)(),
    loginPageTrigger: createAction(AppActionConstants.LOGIN_PAGE_TRIGGER)(),
    loginPageSuccess: createAction(AppActionConstants.LOGIN_PAGE_SUCCESS)(),
    chooseAccountPageTrigger: createAction(AppActionConstants.CHOOSE_ACCOUNT_PAGE_TRIGGER)(),
    chooseAccountPageSelected: createAction(
        AppActionConstants.CHOOSE_ACCOUNT_PAGE_SELECTED
    )<T_ChooseAccountPageSelectedPayload>(),
    chooseAccountPageSuccess: createAction(AppActionConstants.CHOOSE_ACCOUNT_PAGE_SUCCESS)(),
    frontPageTrigger: createAction(AppActionConstants.FRONT_PAGE_TRIGGER)(),
    frontPageSuccess: createAction(AppActionConstants.FRONT_PAGE_SUCCESS)(),
    expiredPageSuccess: createAction(AppActionConstants.EXPIRED_PAGE_SUCCESS)(),
    contactPageSuccess: createAction(AppActionConstants.CONTACT_PAGE_SUCCESS)(),
    getCompanyDataSuccess: createAction(AppActionConstants.GET_COMPANY_DATA_SUCCESSS)(),
    getCompanyDataError: createAction(AppActionConstants.GET_COMPANY_DATA_ERROR)(),
    loanPageTrigger: createAction(AppActionConstants.LOAN_PAGE_TRIGGER)(),
    loanPageSuccess: createAction(AppActionConstants.LOAN_PAGE_SUCCESS)(),
    logoutPageTrigger: createAction(AppActionConstants.LOGOUT_PAGE_TRIGGER)(),
    logoutPageSuccess: createAction(AppActionConstants.LOGOUT_PAGE_SUCCESS)(),
    topupPageTrigger: createAction(AppActionConstants.TOPUP_PAGE_TRIGGER)(),
    topupPageSuccess: createAction(AppActionConstants.TOPUP_PAGE_SUCCESS)(),
    // topupApplicationSendTrigger: createAction(
    //     AppActionConstants.TOPUP_APPLICATION_SEND_TRIGGER
    // )<IncreaseLimitApplication>(),
    translationTrigger: createAction(AppActionConstants.TRANSLATION_TRIGGER)(),
    translationSuccess: createAction(AppActionConstants.TRANSLATION_SUCCESS)(),
    userPageTrigger: createAction(AppActionConstants.USER_PAGE_TRIGGER)(),
    userPageSuccess: createAction(AppActionConstants.USER_PAGE_SUCCESS)(),
    userInfoUpdateTrigger: createAction(
        AppActionConstants.USER_INFO_UPDATE_TRIGGER
    )<T_UpdateUserInfoFormData>(),
    userInfoUpdateSuccess: createAction(AppActionConstants.USER_INFO_UPDATE_SUCCESS)(),
    updateKycState: createAction(AppActionConstants.UPDATE_KYC_STATE)<T_KycState>(),
};

export type AppAction = ActionType<typeof appActions>;
