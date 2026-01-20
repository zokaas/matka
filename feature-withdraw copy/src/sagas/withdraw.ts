import { takeEvery, put, call, select, delay } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";

import { DefaultInitializerType } from "@opr-finance/utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { loginActions } from "@opr-finance/feature-lfp-login";

import { withdrawActions } from "../actions/withdraw";
import {
    WithdrawActionConstants,
    FeatureWithdrawState,
    FrendsWithdrawResponse,
    WithdrawResponseStatus,
} from "../types/withdraw";
import { withdraw } from "../api/withdraw";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchWithdrawTrigger() {
    yield takeEvery(WithdrawActionConstants.WITHDRAW_TRIGGER, handleWithdrawTrigger);
}

export function* handleWithdrawTrigger(action: ActionType<typeof withdrawActions.withdrawTrigger>) {
    yield delay(1000);
    try {
        const { token, mockApiCalls, gwUrl } = (yield select(
            (state: FeatureWithdrawState) => state.withdraw.config
        )) as DefaultInitializerType;

        const response: FrendsWithdrawResponse = yield call(withdraw, {
            body: {
                phoneNumber: action.payload.phoneNumber,
                amount: `${action.payload.amount}`,
            },
            token,
            mockApiCalls,
            gwUrl,
        });

        if (response.status === WithdrawResponseStatus.SUCCESS)
            yield put(withdrawActions.withdrawSuccess(response));
        if (response.status === WithdrawResponseStatus.ERROR)
            yield put(withdrawActions.withdrawError(response));
        if (response.status === WithdrawResponseStatus.UNAUTHORIZED)
            yield put(loginActions.loginCheckStatus());
    } catch (e) {
        logger.log("withdraw trigger failed");
    }
}
