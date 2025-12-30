import { takeEvery, put, takeLatest } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";

import { errorActions } from "@opr-finance/feature-error";
import { engagementActions } from "@opr-finance/feature-sme-customer";

import { AppActionConstants, appActions } from "../actions/actions";
import { E_Routes } from "../types/general";
import { history } from "../utils";

export function* watchChooseAccountPageTrigger() {
    yield takeLatest(
        AppActionConstants.CHOOSE_ACCOUNT_PAGE_TRIGGER,
        handleChooseAccountPageTrigger
    );
}

export function* handleChooseAccountPageTrigger() {
    try {
        yield put(appActions.chooseAccountPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({
                message: "ChooseAccount page load failed" + e,
                url: E_Routes.ERROR,
            })
        );
    }
}

export function* watchSaveSmeIdTrigger() {
    yield takeEvery(AppActionConstants.CHOOSE_ACCOUNT_PAGE_SELECTED, handleSaveSmeIdTrigger);
}

export function* handleSaveSmeIdTrigger(
    action: ActionType<typeof appActions.chooseAccountPageSelected>
) {
    yield put(engagementActions.saveSmeIdSuccess(action.payload.smeId));
    localStorage.setItem("smeId", action.payload.smeId);
    history.push(E_Routes.FRONT);
}
