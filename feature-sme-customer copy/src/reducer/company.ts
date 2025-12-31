import { createReducer } from "typesafe-actions";
import { produce } from "immer";

import { CompanyAction, companyActions } from "../actions";
import { T_CompanyReducerState } from "../types";

const initialCompanyInfoState: T_CompanyReducerState = {
    info: undefined,
    accounts: undefined,
    boardmembers: undefined,
    config: {
        token: "",
        gwUrl: "",
        mock: false,
    },
};

export const companyReducer = createReducer<T_CompanyReducerState, CompanyAction>(
    initialCompanyInfoState
)
    .handleAction(companyActions.companyDataInitializer, (state, action) => {
        return produce(state, (draftState) => {
            draftState.config.gwUrl = action.payload.gwUrl;
            draftState.config.token = action.payload.token;
            draftState.config.mock = action.payload.mock;
        });
    })
    .handleAction(companyActions.getCompanyInfoSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.info = action.payload;
        });
    })
    .handleAction(companyActions.getCompanyAccountsSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.accounts = action.payload;
        });
    })
    .handleAction(companyActions.updateCompanyInfoSuccess, (state, action) => {
        return produce(state, (draftState: any) => {
            let updatedInfo = { ...draftState.info };
            updatedInfo.email = action.payload.email;
            updatedInfo.phone = action.payload.phone;
            updatedInfo.officialAddress.streetAddress = action.payload.streetAddress;
            updatedInfo.officialAddress.zipCode = action.payload.zipCode;
            updatedInfo.officialAddress.city = action.payload.city;

            draftState.info = updatedInfo;
        });
    })
    .handleAction(companyActions.updateBankAccountNumberSuccess, (state, action) => {
        let stateCopy: any = { ...state };
        const {
            accountNumber,
            availableCreditLimit,
            creditLimit,
            remainingPrincipal,
            disbursementAccount,
        } = stateCopy.accounts.accounts[0];
        const newAccount = {
            accountNumber,
            availableCreditLimit,
            creditLimit,
            remainingPrincipal,
            disbursementAccount: {
                bankName: disbursementAccount.bankName,
                disbursementType: disbursementAccount.disbursementType,
                externalAccountNumber: action.payload.number,
            },
        };
        const updatedAccount = {
            id: state?.accounts?.id,
            organizationNumber: state?.accounts?.organizationNumber,
            externalReference: state?.accounts?.externalReference,
            accounts: [newAccount],
        };
        return produce(state, (draftState: any) => {
            draftState.accounts = updatedAccount;
        });
    })
    //TODO: typescript any for action
    .handleAction(companyActions.getCompanyBoardMembersSuccess, (state, action: any) => {
        return produce(state, (draftState) => {
            draftState.boardmembers = action.payload;
        });
    });
