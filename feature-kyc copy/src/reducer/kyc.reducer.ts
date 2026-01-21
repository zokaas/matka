import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { T_KycReducerState } from "../types";
import { T_KycAction, kycActions } from "../actions";

const initialState: T_KycReducerState = {
    kycStatus: {
        kycDone: false,
        kycUpdatedDate: "",
        kycDueDate: "",
    },
    config: {
        token: "",
        bffUrl: "",
        mock: false,
        cid: "",
    },
    showModal: false,
    isLoading: false,
    returnedFromKyc: false,
};

export const kycReducer = createReducer<T_KycReducerState, T_KycAction>(initialState)
    .handleAction(kycActions.kycInitializer, (state, action) => {
        return produce(state, (draftState) => {
            draftState.config.bffUrl = action.payload.bffUrl;
            draftState.config.token = action.payload.token;
            draftState.config.mock = action.payload.mock;
            draftState.config.cid = action.payload.cid;
        });
    })
    .handleAction(kycActions.updateKycState, (state, action) => {
        return produce(state, (draftState) => {
            draftState.kycStatus.kycDone = action.payload.kycDone ?? false;
            draftState.kycStatus.kycUpdatedDate = action.payload.kycUpdatedDate ?? "";
            draftState.kycStatus.kycDueDate = action.payload.kycDueDate ?? "";
        });
    })
    .handleAction(kycActions.updateReturnedFromKycState, (state, action) => {
        return produce(state, (draftState) => {
            draftState.returnedFromKyc = action.payload.returnedFromKyc ?? false;
        });
    })
    .handleAction(kycActions.showModal, (state) => {
        return produce(state, (draftState) => {
            draftState.showModal = true;
        });
    })
    .handleAction(kycActions.hideModal, (state) => {
        return produce(state, (draftState) => {
            draftState.showModal = false;
        });
    })
    .handleAction(kycActions.kycStartFlowTrigger, (state) => {
        return produce(state, (draftState) => {
            draftState.isLoading = true;
        });
    })
    .handleAction(kycActions.kycStartFlowSuccess, (state) => {
        return produce(state, (draftState) => {
            draftState.isLoading = false;
            draftState.showModal = false;
        });
    });
