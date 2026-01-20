"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawReducer = exports.initialState = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const withdraw_1 = require("../types/withdraw");
const withdraw_2 = require("../actions/withdraw");
exports.initialState = {
    config: {
        mockApiCalls: false,
        gwUrl: "",
        token: "",
    },
    withdraw: {
        message: "",
        status: withdraw_1.WithdrawResponseStatus.INITIAL,
    },
};
exports.withdrawReducer = (0, typesafe_actions_1.createReducer)(exports.initialState)
    .handleAction(withdraw_2.withdrawActions.withdrawInitializer, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.config.mockApiCalls = action.payload.mockApiCalls;
        draftState.config.gwUrl = action.payload.gwUrl;
        draftState.config.token = action.payload.token;
    });
})
    .handleAction(withdraw_2.withdrawActions.withdrawError, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.withdraw.status = action.payload.status;
        draftState.withdraw.message = action.payload.message;
    });
})
    .handleAction(withdraw_2.withdrawActions.withdrawSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.withdraw.status = action.payload.status;
        draftState.withdraw.message = action.payload.message;
    });
})
    .handleAction(withdraw_2.withdrawActions.withdrawReset, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.withdraw.status = withdraw_1.WithdrawResponseStatus.INITIAL;
        draftState.withdraw.message = "";
    });
});
//# sourceMappingURL=withdraw.js.map