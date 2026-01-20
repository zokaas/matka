import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { T_KycReducerState } from "../types";
import { T_KycAction, kycActions } from "../actions";

const initialState: T_KycReducerState = {
    kycStatus: {
        isCsReportReady: false,
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
    .handleAction(kycActions.kycFetchCreditSafeReportTrigger, (state, action) => {
        return produce(state, (draftState) => {});
    })
    .handleAction(kycActions.kycFetchCreditSafeReportSuccess, (state, action) => {
        return produce(state, (draftState) => {
            draftState.kycStatus.isCsReportReady = action.payload.isCsReportReady ?? false;
        });
    })
    .handleAction(kycActions.updateKycState, (state, action) => {
        return produce(state, (draftState) => {
            draftState.kycStatus.kycDone = action.payload.kycDone ?? false;
            draftState.kycStatus.kycUpdatedDate = action.payload.kycUpdatedDate ?? "";
        });
    });
