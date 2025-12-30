import { createReducer } from "typesafe-actions";
import { T_KycState } from "../types/kyc";
import { AppAction, appActions } from "../actions/actions";

const initialState: T_KycState = {
    kycDone: false,
    kycUpdatedDate: "",
};

export const kycReducer = createReducer<T_KycState, AppAction>(initialState).handleAction(
    appActions.updateKycState,
    (state, action) => ({
        ...state,
        kycDone: action.payload.kycDone ?? false,
        kycUpdatedDate: action.payload.kycUpdatedDate ?? "",
    })
);
