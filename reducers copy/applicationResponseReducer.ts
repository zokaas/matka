import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { applicationAppActions, applicationAppAction } from "../actions/index.actions";
import { T_ApplicationResponseReducerState } from "../types";
import { T_PostApplicationResponse } from "../api/types";

const initialState: T_ApplicationResponseReducerState = {
    pipelineApplication: null,
    isPosted: false,
};

export const applicationResponseReducer = createReducer<
    T_ApplicationResponseReducerState,
    applicationAppAction
>(initialState).handleAction(applicationAppActions.postApplicationSuccess, (state, action) => {
    return produce(state, (draftState) => {
        (draftState.pipelineApplication = action.payload), (draftState.isPosted = true);
    });
});
