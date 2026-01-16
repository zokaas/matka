import { createReducer } from "typesafe-actions";
import { produce } from "immer";
import { KycReducerState } from "../types/kyc";
import { KycAction, kycActions } from "../actions/kyc";

const initialState: KycReducerState = {
    
};

export const kycReducer = createReducer<KycReducerState, KycAction>(
    initialState
).handleAction(kycActions.kycTrigger, (state, action) => {
    return produce(state, (draftState) => {
        
    });
});
