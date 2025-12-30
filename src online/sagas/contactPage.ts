import { put, select, takeLatest } from "redux-saga/effects";
import { AppActionConstants, appActions } from "../actions/actions";
import { errorActions } from "@opr-finance/feature-error";
import { engagementActions } from "@opr-finance/feature-sme-customer";
import { AppState } from "../types/general";

export function* watchContactPageTrigger() {
    yield takeLatest(AppActionConstants.CONTACT_PAGE_TRIGGER, handleContactPageTrigger);
}

export function* handleContactPageTrigger() {
    const engagements = yield select((state: AppState) => state.customer.engagement.engagements);
    try {
        if (!Array.isArray(engagements)) yield put(engagementActions.engagementTrigger());
        yield put(appActions.contactPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "contact page load failed" + e, url: "/error" })
        );
    }
}
