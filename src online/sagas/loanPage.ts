import { call, put, race, take, takeLatest, all } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { AppActionConstants, appActions } from "../actions/actions";
import {
    getAccountData,
    getTransactionsData,
    setAccountConfig,
    setTransactionsConfig,
    setInvoiceConfig,
    getInvoiceData,
    setReportingConfig,
} from "./common.saga";
import { engagementActions } from "@opr-finance/feature-sme-customer";
import { AppState } from "../types/general";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchLoanPageTrigger() {
    yield takeLatest(AppActionConstants.LOAN_PAGE_TRIGGER, handleLoanPageTrigger);
}

export function* handleLoanPageTrigger() {
    try {
        yield put(engagementActions.engagementTrigger());

        const { engagementSuccess, engagementError } = yield race({
            engagementSuccess: take(engagementActions.engagementSuccess),
            engagementError: take(engagementActions.engagementError),
        });

        if (engagementError) {
            logger.log("error getting engagements");
            window.location.href = "/error";
        }

        yield call(setAccountConfig);
        yield call(getAccountData);
        yield all([call(setTransactionsConfig), call(setInvoiceConfig), call(setReportingConfig)]);
        yield all([call(getTransactionsData), call(getInvoiceData)]);

        yield put(appActions.loanPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "loanpage load failed" + e, url: "/error" })
        );
    }
}
