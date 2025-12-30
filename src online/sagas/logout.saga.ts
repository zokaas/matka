import { call, put, select, takeLatest } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";
import {
    loginSessionActions,
    T_FeatureLoginSessionState,
} from "@opr-finance/feature-login-session";

import { AppActionConstants, appActions } from "../actions/actions";

export function* watchLogoutPageTrigger() {
    yield takeLatest(AppActionConstants.LOGOUT_PAGE_TRIGGER, handleLogoutPageTrigger);
}

export function* handleLogoutPageTrigger() {
    try {
        yield put(appActions.logoutPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "Logout page load failed" + e, url: "/error" })
        );
    }
}
