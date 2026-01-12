import { call, put, select, takeLatest } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";

import { AppActionConstants, appActions } from "../actions/actions";
import { cleanLocalStorage } from "../utils";
import { engagementActions } from "@opr-finance/feature-sme-customer";
import { AppState } from "../types/general";

export function* watchExpiredPageTrigger() {
    yield takeLatest(AppActionConstants.EXPIRED_PAGE_TRIGGER, handleExpiredPageTrigger);
}

export function* handleExpiredPageTrigger() {
    const engagements = yield select((state: AppState) => state.customer.engagement.engagements);
    try {
        if (!Array.isArray(engagements)) yield put(engagementActions.engagementTrigger());
        yield call(cleanLocalStorage);
        yield put(appActions.expiredPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "Expired page load failed" + e, url: "/error" })
        );
    }
}
