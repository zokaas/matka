import { put, take, delay, takeLatest } from "redux-saga/effects";

import { loginSessionActions } from "@opr-finance/features/login-session";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

import { ActionType } from "typesafe-actions";
import { AppActionConstants, applicationAppActions } from "../actions/index.actions";
import { T_BffProps } from "../types";
import { getBffProps } from "../utils";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

const bff: T_BffProps = getBffProps();
export function* watchAuthenticateTrigger() {
    yield takeLatest(AppActionConstants.AUTHENTICATE_TRIGGER, handleAuthenticateTrigger);
}

export function* handleAuthenticateTrigger(
    action: ActionType<typeof applicationAppActions.authenticateTrigger>
): any {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    localStorage.setItem("id", id ?? "");
    try {
        yield delay(200); //quick fix to prevent infinite loop
        yield put(loginSessionActions.loginSessionInitializer(bff));

        yield put(loginSessionActions.loginSessionGetUser());
        yield take(loginSessionActions.loginSessionSuccess);
        yield put(applicationAppActions.authenticateSuccess());
    } catch (e) {
        logger.log("Authenticate page trigger failed");
    }
}
