import { put, select, call, takeLatest } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";
import { loaderActions } from "@opr-finance/feature-loader";
import { engagementActions } from "@opr-finance/feature-sme-customer";

import { AppState } from "../types/general";
import { AppActionConstants, appActions } from "../actions/actions";
import { getTranslations, loginSessionFeatureInitializer, saveLoginSession } from "./common.saga";

export function* watchApplicationTrigger() {
    yield takeLatest(AppActionConstants.APPLICATION_TRIGGER, handleApplicationTrigger);
}

export function* handleApplicationTrigger() {
    const messages = yield select((state: AppState) => state.translation.messages);
    const activeSmeId = (yield select(
        (state: AppState) => state.customer.engagement.activeSmeId
    )) as string;
    const token = localStorage.getItem("token");
    const savedSmeId = localStorage.getItem("smeId");

    try {
        yield call(loginSessionFeatureInitializer);

        if (!messages) {
            yield call(getTranslations);
            console.log("messages", messages);
        }

        if (token) yield call(saveLoginSession);

        if (!activeSmeId && savedSmeId) {
            yield put(engagementActions.saveSmeIdSuccess(savedSmeId));
        }

        yield put(appActions.applicationSuccess());
        yield put(loaderActions.loaderTrigger({ loading: false }));
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "App saga load failed" + e, url: "/error" })
        );
    }
}
