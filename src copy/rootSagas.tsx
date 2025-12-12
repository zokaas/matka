import { all, fork } from "redux-saga/effects";

import { watchPageInitializers } from "@opr-finance/features/Initializer";
import { watchLoginSessionTrigger } from "@opr-finance/features/login-session";
import { watchStartPageTrigger } from "./sagas/startPage.saga";
import { watchAuthenticateTrigger } from "./sagas/authenticate.saga";
import {
    watchLoginSessionGetUser,
    watchLoginSessionVerify,
} from "@opr-finance/features/login-session/sagas";
import { watchRefreshSession } from "@opr-finance/features/refresh-session";
import {
    watchApplicationPageTrigger,
    watchFetchApplicationTrigger,
} from "./sagas/applicationPage.saga";

export function* rootSaga() {
    yield all([
        fork(watchPageInitializers),
        fork(watchStartPageTrigger),
        fork(watchLoginSessionTrigger),
        fork(watchLoginSessionTrigger),
        fork(watchAuthenticateTrigger),
        fork(watchApplicationPageTrigger),
        fork(watchFetchApplicationTrigger),
        fork(watchLoginSessionGetUser),
        fork(watchLoginSessionVerify),
        fork(watchRefreshSession),
    ]);
}
