import { createAction, ActionType } from "typesafe-actions";

import {
    E_CompanyActionConstants,
    T_CompanyApiResponse,
    T_ResponseError,
    T_UpdateBankAccountNumberPayload,
    T_UpdateCompanyInfoPayload,
} from "../types";
import { T_CompanyDataInitializerPayload } from "../types/company";

type T_SmeID = {
    smeId: string;
};

export const companyActions = {
    companyDataInitializer: createAction(
        E_CompanyActionConstants.GET_COMPANY_DATA_INITIALIZEER
    )<T_CompanyDataInitializerPayload>(),
    getCompanyInfoTrigger: createAction(
        E_CompanyActionConstants.GET_COMPANY_INFO_TRIGGER
    )<T_SmeID>(),
    getCompanyInfoSuccess: createAction(
        E_CompanyActionConstants.GET_COMPANY_INFO_SUCCESS
    )<T_CompanyApiResponse>(),
    updateCompanyInfoTrigger: createAction(
        E_CompanyActionConstants.UPDATE_COMPANY_INFO_TRIGGER
    )<T_UpdateCompanyInfoPayload>(),
    updateCompanyInfoSuccess: createAction(
        E_CompanyActionConstants.UPDATE_COMPANY_INFO_SUCCESS
    )<T_UpdateCompanyInfoPayload>(),
    updateBankAccountNumberTrigger: createAction(
        E_CompanyActionConstants.UPDATE_BANK_ACCOUNT_NUMBER_TRIGGER
    )<T_UpdateBankAccountNumberPayload>(),
    updateBankAccountNumberSuccess: createAction(
        E_CompanyActionConstants.UPDATE_BANK_ACCOUNT_NUMBER_SUCCESS
    )<T_UpdateBankAccountNumberPayload>(),
    getCompanyInfoError: createAction(
        E_CompanyActionConstants.GET_COMPANY_INFO_ERROR
    )<T_ResponseError>(),

    getCompanyAccountsTrigger: createAction(
        E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_TRIGGER
    )<T_SmeID>(),
    getCompanyAccountsSuccess: createAction(
        E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_SUCCESS
    )<T_CompanyApiResponse>(),
    getCompanyAccountsError: createAction(
        E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_ERROR
    )<T_ResponseError>(),

    getCompanyBoardMembersTrigger: createAction(
        E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_TRIGGER
    )<T_SmeID>(),
    getCompanyBoardMembersSuccess: createAction(
        E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_SUCCESS
    )<T_CompanyApiResponse>(),
    getCompanyBoardMembersError: createAction(
        E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_ERROR
    )<T_ResponseError>(),
};

export type CompanyAction = ActionType<typeof companyActions>;
