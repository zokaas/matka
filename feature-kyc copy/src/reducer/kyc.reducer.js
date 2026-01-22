"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycReducer = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const actions_1 = require("../actions");
const initialState = {
    kycStatus: {
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
    showModal: false,
    isLoading: false,
    returnedFromKyc: false,
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
    .handleAction(actions_1.kycActions.updateKycState, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        var _a, _b, _c;
        draftState.kycStatus.kycDone = (_a = action.payload.kycDone) !== null && _a !== void 0 ? _a : false;
        draftState.kycStatus.kycUpdatedDate = (_b = action.payload.kycUpdatedDate) !== null && _b !== void 0 ? _b : "";
        draftState.kycStatus.kycDueDate = (_c = action.payload.kycDueDate) !== null && _c !== void 0 ? _c : "";
    });
})
    .handleAction(actions_1.kycActions.updateReturnedFromKycState, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        var _a;
        draftState.returnedFromKyc = (_a = action.payload.returnedFromKyc) !== null && _a !== void 0 ? _a : false;
    });
})
    .handleAction(actions_1.kycActions.showModal, (state) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.showModal = true;
    });
})
    .handleAction(actions_1.kycActions.hideModal, (state) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.showModal = false;
    });
})
    .handleAction(actions_1.kycActions.kycStartFlowTrigger, (state) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.isLoading = true;
    });
})
    .handleAction(actions_1.kycActions.kycStartFlowSuccess, (state) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.isLoading = true;
        draftState.showModal = true;
    });
});
//# sourceMappingURL=kyc.reducer.js.map