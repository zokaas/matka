import { takeEvery, call, put, take, select } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";

import { AppActionConstants, appActions } from "../actions/actions";
import { cleanLocalStorage } from "../utils";
import {
    loginSessionActions,
    T_FeatureLoginSessionState,
} from "@opr-finance/feature-login-session";
import { noticesActions } from "@opr-finance/feature-contentful";

export function* watchStartPageTrigger() {
    yield takeEvery(AppActionConstants.START_PAGE_TRIGGER, handleStartPageTrigger);
}

export function* handleStartPageTrigger() {
    try {
        const sessionToken = yield select(
            (state: T_FeatureLoginSessionState) => state.session.token
        );
        if (sessionToken) {
            yield put(loginSessionActions.loginSessionEnd());
        }
        yield call(cleanLocalStorage);
        yield put(
            noticesActions.fetchNoticesTrigger({
                clientParams: {
                    space: process.env.REACT_APP_CONTENTFUL_SPACE as string,
                    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN as string,
                },
                contentParams: {
                    select: "fields,sys.createdAt",
                    content_type: "staticContentNotice",
                    "fields.application[in]": "Flex Online SE",
                },
            })
        );

        yield take(noticesActions.fetchNoticesTrigger);
        yield put(appActions.startPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "Start page load failed" + e, url: "/error" })
        );
    }
}
