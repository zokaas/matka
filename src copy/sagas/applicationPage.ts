import { take, put, call, select, takeLatest, race, all } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";
import {
    applicationActions,
    companyActions,
    engagementActions,
} from "@opr-finance/feature-sme-customer";
import { history } from "@opr-finance/utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { AppState, E_Routes } from "../types/general";
import { checkSession } from "./common.saga";
import { AppActionConstants, appActions } from "../actions/actions";
import { T_GatewayProps } from "@opr-finance/utils/src/types/general";
import { getGwProps } from "@opr-finance/utils/src/getGwProps";
import {
    fetchAndHandleSessionInfo,
    loginSessionActions,
    T_FeatureLoginSessionState,
    T_LoginSessionReducerState,
} from "@opr-finance/feature-login-session";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchApplicationPageTrigger() {
    yield takeLatest(AppActionConstants.APPLICATION_PAGE_TRIGGER, handleApplicationPageTrigger);
}

export function* handleApplicationPageTrigger() {
    try {
        const state: AppState = yield select((state: AppState) => state);
        const { customer, session } = state;
        const token = session.token;
        const applicationData = customer.application.application;
        if (token) {
            yield call(checkSession);

            yield call(restoreSession, token);
            yield put(engagementActions.engagementTrigger());

            const { engagementSuccess, engagementError } = yield race({
                engagementSuccess: take(engagementActions.engagementSuccess),
                engagementError: take(engagementActions.engagementError),
            });

            if (engagementError) {
                logger.error("error getting engagements");
                window.location.href = "/error";
            }

            if (!applicationData) yield put(applicationActions.applicationTrigger());

            yield put(loginSessionActions.loginSessionVerify());

            yield put(appActions.applicationPageSuccess());
        }
    } catch (e) {
        history.push(E_Routes.ERROR);
        yield put(
            errorActions.errorTrigger({
                message: "application page load failed" + e,
                url: "/error",
            })
        );
    }
}

export function* restoreSession(token: string): Generator {
    const { config } = (yield select(
        (state: T_FeatureLoginSessionState) => state.session
    )) as T_LoginSessionReducerState;

    yield call(fetchAndHandleSessionInfo, token, config);
}
