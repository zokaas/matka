import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { WithdrawReducerState, WithdrawResponseStatus } from "../types/withdraw";
import { WithdrawAction, withdrawActions } from "../actions/withdraw";

export const initialState = {
    config: {
        mockApiCalls: false,
        gwUrl: "",
        token: "",
    },
    withdraw: {
        message: "",
        status: WithdrawResponseStatus.INITIAL,
    },
};

export const withdrawReducer = createReducer<WithdrawReducerState, WithdrawAction>(initialState)
    .handleAction(withdrawActions.withdrawInitializer, (state, action) => {
        return produce(state, (draftState) => {
            draftState.config.mockApiCalls = action.payload.mockApiCalls;
            draftState.config.gwUrl = action.payload.gwUrl;
            draftState.config.token = action.payload.token;
        });
    })
    .handleAction(withdrawActions.withdrawError, (state, action) => {
        return produce(state, (draftState) => {
            draftState.withdraw.status = action.payload.status;
            draftState.withdraw.message = action.payload.message;
        });
    })
    .handleAction(withdrawActions.withdrawSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.withdraw.status = action.payload.status;
            draftState.withdraw.message = action.payload.message;
        });
    })
    .handleAction(withdrawActions.withdrawReset, (state, action) => {
        return produce(state, (draftState) => {
            draftState.withdraw.status = WithdrawResponseStatus.INITIAL;
            draftState.withdraw.message = "";
        });
    });
