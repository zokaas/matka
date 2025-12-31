import { createReducer } from "typesafe-actions";
import { produce } from "immer";

import { T_EngagementReducerState } from "../types";
import { EngagementAction, engagementActions } from "../actions";

const initialState: T_EngagementReducerState = {
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

export const engagementReducer = createReducer<T_EngagementReducerState, EngagementAction>(
    initialState
)
    .handleAction(engagementActions.engagementInitializer, (state, action) => {
        return produce(state, (draftState) => {
            draftState.config.gwUrl = action.payload.gwUrl;
            draftState.config.token = action.payload.token;
            draftState.config.role = action.payload.role;
            draftState.config.reference = action.payload.reference;
            draftState.config.mock = action.payload.mock;
            draftState.config.refType = action.payload.refType;
        });
    })
    .handleAction(engagementActions.engagementSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.engagements = action.payload;
        });
    })
    .handleAction(engagementActions.saveSmeIdSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.activeSmeId = action.payload;
        });
    });
