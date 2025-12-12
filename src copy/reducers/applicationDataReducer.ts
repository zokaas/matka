import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { applicationAppActions, applicationAppAction } from "../actions/index.actions";
import { T_ApplicationDataReducerState, T_PrefilledApplicationData } from "../types";

const initialState: T_ApplicationDataReducerState = {
    data: null,
};

export const applicationDataReducer = createReducer<
    T_ApplicationDataReducerState,
    applicationAppAction
>(initialState).handleAction(applicationAppActions.fetchApplicationSuccess, (state, action) => {
    return produce(state, (draftState: { data: T_PrefilledApplicationData }) => {
        draftState.data = action.payload;
    });
});
