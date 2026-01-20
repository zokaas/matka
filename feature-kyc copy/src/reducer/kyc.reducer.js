"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycReducer = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const actions_1 = require("../actions");
const initialState = {
    kycStatus: {
        isCsReportReady: false,
        kycDone: false,
        kycUpdatedDate: "",
        kycDueDate: "",
    },
    config: {
        token: "",
        bffUrl: "",
        mock: false,
        cid: "",
    },
};
exports.kycReducer = (0, typesafe_actions_1.createReducer)(initialState)
    .handleAction(actions_1.kycActions.kycInitializer, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.config.bffUrl = action.payload.bffUrl;
        draftState.config.token = action.payload.token;
        draftState.config.mock = action.payload.mock;
        draftState.config.cid = action.payload.cid;
    });
})
    .handleAction(actions_1.kycActions.kycFetchCreditSafeReportTrigger, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => { });
})
    .handleAction(actions_1.kycActions.kycFetchCreditSafeReportSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        var _a;
        draftState.kycStatus.isCsReportReady = (_a = action.payload.isCsReportReady) !== null && _a !== void 0 ? _a : false;
    });
})
    .handleAction(actions_1.kycActions.updateKycState, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        var _a, _b;
        draftState.kycStatus.kycDone = (_a = action.payload.kycDone) !== null && _a !== void 0 ? _a : false;
        draftState.kycStatus.kycUpdatedDate = (_b = action.payload.kycUpdatedDate) !== null && _b !== void 0 ? _b : "";
    });
});
//# sourceMappingURL=kyc.reducer.js.map