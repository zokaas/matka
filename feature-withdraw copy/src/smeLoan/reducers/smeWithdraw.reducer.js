"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smeWithdrawReducer = exports.initialState = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const smeWithdraw_types_1 = require("../types/smeWithdraw.types");
const smeWithdraw_action_1 = require("../actions/smeWithdraw.action");
exports.initialState = {
    config: {
        mockApiCalls: false,
        gwUrl: "",
        token: "",
    },
    withdraw: {
        message: "",
        status: smeWithdraw_types_1.SmeWithdrawResponseStatus.INITIAL,
    },
};
exports.smeWithdrawReducer = (0, typesafe_actions_1.createReducer)(exports.initialState)
    .handleAction(smeWithdraw_action_1.smeWithdrawActions.withdrawInitializer, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.config.mockApiCalls = action.payload.mockApiCalls;
        draftState.config.gwUrl = action.payload.gwUrl;
        draftState.config.token = action.payload.token;
    });
})
    .handleAction(smeWithdraw_action_1.smeWithdrawActions.withdrawError, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.withdraw.status = action.payload.status;
        draftState.withdraw.message = action.payload.message;
    });
})
    .handleAction(smeWithdraw_action_1.smeWithdrawActions.withdrawSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.withdraw.status = action.payload.status;
        draftState.withdraw.message = action.payload.message;
    });
})
    .handleAction(smeWithdraw_action_1.smeWithdrawActions.withdrawReset, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.withdraw.status = smeWithdraw_types_1.SmeWithdrawResponseStatus.INITIAL;
        draftState.withdraw.message = "";
    });
});
//# sourceMappingURL=smeWithdraw.reducer.js.map