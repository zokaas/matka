import { put, call, takeLatest, select, race, take } from "redux-saga/effects";
import { errorActions } from "@opr-finance/feature-error";

import { AppActionConstants, appActions } from "../actions/actions";
import { getAccountData, getInvoiceData, setAccountConfig, setInvoiceConfig } from "./common.saga";
import { engagementActions } from "@opr-finance/feature-sme-customer";
import { AppState } from "../types/general";

export function* watchTopupPageTrigger() {
    yield takeLatest(AppActionConstants.TOPUP_PAGE_TRIGGER, handleTopupPageTrigger);
}

export function* handleTopupPageTrigger() {
    const engagements = yield select((state: AppState) => state.customer.engagement.engagements);
    try {
        yield put(engagementActions.engagementTrigger());

        const { engagementSuccess, engagementError } = yield race({
            engagementSuccess: take(engagementActions.engagementSuccess),
            engagementError: take(engagementActions.engagementError),
        });

        if (engagementError) {
            console.log("error getting engagements");
            window.location.href = "/error";
        }

        yield call(setAccountConfig);
        yield call(getAccountData);
        yield call(setInvoiceConfig);
        yield call(getInvoiceData);
        // yield call(getTransactionsData)

        yield put(appActions.topupPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "Topup page load failed" + e, url: "/error" })
        );
    }
}
