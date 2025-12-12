import { takeEvery, put } from "redux-saga/effects";

import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/features/console-logger";

import { ActionType } from "typesafe-actions";
import { AppActionConstants, applicationAppActions } from "../actions/index.actions";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchStartPageTrigger() {
    yield takeEvery(AppActionConstants.START_PAGE_TRIGGER, handleStartPageTrigger);
}

export function* handleStartPageTrigger(
    action: ActionType<typeof applicationAppActions.startPageInitTrigger>
) {
    try {
        yield put(applicationAppActions.startPageInitSuccess());
    } catch (e) {
        logger.log("Start page trigger failed");
    }
}
