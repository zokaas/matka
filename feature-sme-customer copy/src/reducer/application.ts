import { createReducer } from "typesafe-actions";
import { produce } from "immer";

import { T_ApplicationReducerState } from "../types";
import { ApplicationAction, applicationActions } from "../actions";

const initialState: T_ApplicationReducerState = {
    application: undefined,
    config: {
        token: "",
        gwUrl: "",
        mock: false,
    },
};

export const applicationReducer = createReducer<T_ApplicationReducerState, ApplicationAction>(
    initialState
)
    .handleAction(applicationActions.applicationInitializer, (state, action) => {
        return produce(state, (draftState) => {
            draftState.config.gwUrl = action.payload.gwUrl;
            draftState.config.token = action.payload.token;
            draftState.config.mock = action.payload.mock;
        });
    })
    .handleAction(applicationActions.applicationSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.application = action.payload;
        });
    });
