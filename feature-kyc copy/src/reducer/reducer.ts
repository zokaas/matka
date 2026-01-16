import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { KycReducerState } from "../types/types";
import { KycAction, kycActions } from "../actions/actions";

const initialState: KycReducerState = {
    showModal: false,
    deadlineInfo: undefined,
};

export const kycReducer = createReducer<KycReducerState, KycAction>(initialState)
    .handleAction(kycActions.showModal, (state) => {
        return produce(state, (draftState) => {
            draftState.showModal = true;
        });
    })
    .handleAction(kycActions.hideModal, (state) => {
        return produce(state, (draftState) => {
            draftState.showModal = false;
        });
    });
