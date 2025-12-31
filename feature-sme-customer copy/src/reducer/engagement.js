"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engagementReducer = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const actions_1 = require("../actions");
const initialState = {
    engagements: undefined,
    config: {
        token: "",
        gwUrl: "",
        role: "customer",
        mock: false,
        reference: "",
        refType: "",
    },
    activeSmeId: "",
};
exports.engagementReducer = (0, typesafe_actions_1.createReducer)(initialState)
    .handleAction(actions_1.engagementActions.engagementInitializer, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.config.gwUrl = action.payload.gwUrl;
        draftState.config.token = action.payload.token;
        draftState.config.role = action.payload.role;
        draftState.config.reference = action.payload.reference;
        draftState.config.mock = action.payload.mock;
        draftState.config.refType = action.payload.refType;
    });
})
    .handleAction(actions_1.engagementActions.engagementSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.engagements = action.payload;
    });
})
    .handleAction(actions_1.engagementActions.saveSmeIdSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.activeSmeId = action.payload;
    });
});
//# sourceMappingURL=engagement.js.map