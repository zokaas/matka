"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyActions = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const types_1 = require("../types");
exports.companyActions = {
    companyDataInitializer: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_DATA_INITIALIZEER)(),
    getCompanyInfoTrigger: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_INFO_TRIGGER)(),
    getCompanyInfoSuccess: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_INFO_SUCCESS)(),
    updateCompanyInfoTrigger: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.UPDATE_COMPANY_INFO_TRIGGER)(),
    updateCompanyInfoSuccess: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.UPDATE_COMPANY_INFO_SUCCESS)(),
    updateBankAccountNumberTrigger: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.UPDATE_BANK_ACCOUNT_NUMBER_TRIGGER)(),
    updateBankAccountNumberSuccess: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.UPDATE_BANK_ACCOUNT_NUMBER_SUCCESS)(),
    getCompanyInfoError: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_INFO_ERROR)(),
    getCompanyAccountsTrigger: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_TRIGGER)(),
    getCompanyAccountsSuccess: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_SUCCESS)(),
    getCompanyAccountsError: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_ERROR)(),
    getCompanyBoardMembersTrigger: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_TRIGGER)(),
    getCompanyBoardMembersSuccess: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_SUCCESS)(),
    getCompanyBoardMembersError: (0, typesafe_actions_1.createAction)(types_1.E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_ERROR)(),
};
//# sourceMappingURL=company.js.map