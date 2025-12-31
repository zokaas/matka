"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationReducer = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const immer_1 = require("immer");
const actions_1 = require("../actions");
const initialState = {
    application: undefined,
    config: {
        token: "",
        gwUrl: "",
        mock: false,
    },
};
exports.applicationReducer = (0, typesafe_actions_1.createReducer)(initialState)
    .handleAction(actions_1.applicationActions.applicationInitializer, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.config.gwUrl = action.payload.gwUrl;
        draftState.config.token = action.payload.token;
        draftState.config.mock = action.payload.mock;
    });
})
    .handleAction(actions_1.applicationActions.applicationSuccess, (state, action) => {
    return (0, immer_1.produce)(state, (draftState) => {
        draftState.application = action.payload;
    });
});
//# sourceMappingURL=application.js.map