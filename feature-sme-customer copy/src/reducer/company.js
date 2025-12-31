"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyReducer = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const actions_1 = require("../actions");
const initialCompanyInfoState = {
    info: undefined,
    accounts: undefined,
    boardmembers: undefined,
    config: {
        token: "",
        gwUrl: "",
        mock: false,
    },
};
exports.companyReducer = (0, typesafe_actions_1.createReducer)(initialCompanyInfoState)
    .handleAction(actions_1.companyActions.companyDataInitializer, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.config.gwUrl = action.payload.gwUrl;
        draftState.config.token = action.payload.token;
        draftState.config.mock = action.payload.mock;
    });
})
    .handleAction(actions_1.companyActions.getCompanyInfoSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.info = action.payload;
    });
})
    .handleAction(actions_1.companyActions.getCompanyAccountsSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.accounts = action.payload;
    });
})
    .handleAction(actions_1.companyActions.updateCompanyInfoSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        let updatedInfo = Object.assign({}, draftState.info);
        updatedInfo.email = action.payload.email;
        updatedInfo.phone = action.payload.phone;
        updatedInfo.officialAddress.streetAddress = action.payload.streetAddress;
        updatedInfo.officialAddress.zipCode = action.payload.zipCode;
        updatedInfo.officialAddress.city = action.payload.city;
        draftState.info = updatedInfo;
    });
})
    .handleAction(actions_1.companyActions.updateBankAccountNumberSuccess, (state, action) => {
    var _a, _b, _c;
    let stateCopy = Object.assign({}, state);
    const { accountNumber, availableCreditLimit, creditLimit, remainingPrincipal, disbursementAccount, } = stateCopy.accounts.accounts[0];
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
        id: (_a = state === null || state === void 0 ? void 0 : state.accounts) === null || _a === void 0 ? void 0 : _a.id,
        organizationNumber: (_b = state === null || state === void 0 ? void 0 : state.accounts) === null || _b === void 0 ? void 0 : _b.organizationNumber,
        externalReference: (_c = state === null || state === void 0 ? void 0 : state.accounts) === null || _c === void 0 ? void 0 : _c.externalReference,
        accounts: [newAccount],
    };
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.accounts = updatedAccount;
    });
})
    .handleAction(actions_1.companyActions.getCompanyBoardMembersSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.boardmembers = action.payload;
    });
});
//# sourceMappingURL=company.js.map