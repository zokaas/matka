import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { SmeWithdrawResponseStatus, SmeWithdrawReducerState } from "../types/smeWithdraw.types";
import { SmeWithdrawAction, smeWithdrawActions } from "../actions/smeWithdraw.action";

export const initialState = {
    config: {
        mockApiCalls: false,
        gwUrl: "",
        token: "",
    },
    withdraw: {
        message: "",
        status: SmeWithdrawResponseStatus.INITIAL,
    },
};

export const smeWithdrawReducer = createReducer<SmeWithdrawReducerState, SmeWithdrawAction>(
    initialState
)
    .handleAction(smeWithdrawActions.withdrawInitializer, (state, action) => {
        return produce(state, (draftState) => {
            draftState.config.mockApiCalls = action.payload.mockApiCalls;
            draftState.config.gwUrl = action.payload.gwUrl;
            draftState.config.token = action.payload.token;
        });
    })
    .handleAction(smeWithdrawActions.withdrawError, (state, action) => {
        return produce(state, (draftState) => {
            draftState.withdraw.status = action.payload.status;
            draftState.withdraw.message = action.payload.message;
        });
    })
    .handleAction(smeWithdrawActions.withdrawSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.withdraw.status = action.payload.status;
            draftState.withdraw.message = action.payload.message;
        });
    })
    .handleAction(smeWithdrawActions.withdrawReset, (state, action) => {
        return produce(state, (draftState) => {
            draftState.withdraw.status = SmeWithdrawResponseStatus.INITIAL;
            draftState.withdraw.message = "";
        });
    });
