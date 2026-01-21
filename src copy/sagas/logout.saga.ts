import { call, put, select, takeLatest } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";

import { AppActionConstants, appActions } from "../actions/actions";
import { clearSessionStorage } from "../utils/clearSessionStorage";

export function* watchLogoutPageTrigger() {
    yield takeLatest(AppActionConstants.LOGOUT_PAGE_TRIGGER, handleLogoutPageTrigger);
}

export function* handleLogoutPageTrigger() {
    try {
        yield put(appActions.logoutPageSuccess());
        clearSessionStorage();
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "Logout page load failed" + e, url: "/error" })
        );
    }
}
