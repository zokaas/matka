"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycReducer = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const actions_1 = require("../actions/actions");
const initialState = {
    showModal: false,
    deadlineInfo: undefined,
};
exports.kycReducer = (0, typesafe_actions_1.createReducer)(initialState)
    .handleAction(actions_1.kycActions.showModal, (state) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.showModal = true;
    });
})
    .handleAction(actions_1.kycActions.hideModal, (state) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.showModal = false;
    });
});
//# sourceMappingURL=reducer.js.map