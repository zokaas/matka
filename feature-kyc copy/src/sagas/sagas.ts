import { takeLatest, put } from "redux-saga/effects";
import { kycActions, E_KycActionConstants } from "../actions/actions";

function* handleKycValidation() {
    try {
        // Add validation logic if needed
        yield put(kycActions.validationSuccess());
    } catch (error) {
        yield put(kycActions.validationFailed({ message: String(error) }));
    }
}

export function* watchKycValidation() {
    yield takeLatest(E_KycActionConstants.VALIDATION_START, handleKycValidation);
}