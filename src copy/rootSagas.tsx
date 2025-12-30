import { all, fork } from "redux-saga/effects";
import { watchInitializers } from "@opr-finance/feature-initializer";
import { watchStartPipelineTrigger } from "./sagas/pipeline";

export function* rootSaga() {
    yield all([fork(watchStartPipelineTrigger), fork(watchInitializers)]);
}
