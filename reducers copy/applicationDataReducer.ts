import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { applicationAppActions, applicationAppAction } from "../actions/index.actions";
import { T_ApplicationDataReducerState, T_PrefilledApplicationData } from "../types";

const initialState: T_ApplicationDataReducerState = {
    data: null,
    isLoading: false,
    isLoaded: false,
};

export const applicationDataReducer = createReducer<
    T_ApplicationDataReducerState,
    applicationAppAction
>(initialState)
    .handleAction(applicationAppActions.fetchApplicationRequest, (state) =>
        produce(state, (draft) => {
            draft.isLoading = true;
            draft.isLoaded = false;
        })
    )

    .handleAction(applicationAppActions.fetchApplicationSuccess, (state, action) =>
        produce(state, (draft) => {
            draft.data = action.payload;
            draft.isLoading = false;
            draft.isLoaded = true;
        })
    );
