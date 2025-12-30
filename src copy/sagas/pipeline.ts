import { takeEvery } from "redux-saga/effects";

import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { AppActionConstants } from "../actions/actions";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchStartPipelineTrigger() {
    yield takeEvery(AppActionConstants.SE_PIPELINE_TRIGGER, handleStartPipelineTrigger);
}

export function* handleStartPipelineTrigger() {
    try {
        yield logger.log("swedish pipeline initializer");
    } catch (e) {
        logger.log("fetch front page trigger failed");
    }
}
