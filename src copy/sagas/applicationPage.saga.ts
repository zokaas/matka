import { loginSessionActions } from "@opr-finance/features/login-session";
import * as Effects from "redux-saga/effects";

import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

import { ActionType } from "typesafe-actions";
import { AppActionConstants, applicationAppActions } from "../actions/index.actions";
import { T_BffProps, T_PrefilledApplicationData } from "../types";
import { getApplication } from "../api/getApplication";
import { getBffProps } from "../utils";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

const bff: T_BffProps = getBffProps();

const { delay, put, take, takeLatest, takeLeading } = Effects;
const call: any = Effects.call;

export function* watchApplicationPageTrigger() {
    yield takeLeading(AppActionConstants.APPLICATION_PAGE_TRIGGER, handleApplicationPageTrigger);
}

export function* handleApplicationPageTrigger(
    action: ActionType<typeof applicationAppActions.applicationPageTrigger>
): any {
    yield delay(200); //quick fix to prevent infinite loop
    try {
        yield put(loginSessionActions.loginSessionInitializer(bff));
        const applicationUuid = localStorage.getItem("applicationUuid") ?? "";
        const marketingPageUrl = import.meta.env.VITE_MARKETING_PAGE as string;

        if (!applicationUuid) {
            window.location.href = marketingPageUrl;
            return;
        }

        yield put(loginSessionActions.loginSessionGetUser());
        yield put(loginSessionActions.loginSessionVerify());
        yield take(loginSessionActions.loginSessionSuccess);
        yield put(applicationAppActions.fetchApplicationRequest());
        yield put(applicationAppActions.applicationPageSuccess());
    } catch (e) {
        logger.log("Application page trigger failed");
    }
}

export function* watchFetchApplicationTrigger() {
    yield takeLatest(AppActionConstants.FETCH_APPLICATION_REQUEST, handleFetchApplicationTrigger);
}

export function* handleFetchApplicationTrigger(): unknown {
    try {
        const response: T_PrefilledApplicationData = yield call(getApplication);
        yield put(applicationAppActions.fetchApplicationSuccess(response));
    } catch (e) {
        logger.log("Fetch Application Data trigger failed");
    }
}
