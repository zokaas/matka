import { takeEvery, put, call, select } from "redux-saga/effects";
import { KycActionConstants } from "../types/kyc";
import { kycActions } from "../actions/kyc";
import { ActionType } from "typesafe-actions";

export function* watchKycTrigger() {
    yield takeEvery(KycActionConstants.KYC_TRIGGER, handleKycTrigger);
}

export function* handleKycTrigger(action: ActionType<typeof kycActions.kycTrigger>) {
    try {

        console.log("got action", action);

    } catch (e) {
        console.log("action trigger failed", e);
    }
}
