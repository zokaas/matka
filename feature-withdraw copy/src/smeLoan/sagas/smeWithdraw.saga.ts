import { takeEvery, put, call, select } from "redux-saga/effects";
import { DefaultInitializerType } from "@opr-finance/utils";

import { smeWithdraw } from "../api/smeWithdraw.api";
import { ActionType } from "typesafe-actions";
import { loginActions } from "@opr-finance/feature-lfp-login";
import { T_SmeLoan_FeatureAccountState } from "@opr-finance/feature-account";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { smeWithdrawActions } from "../actions/smeWithdraw.action";
import {
    FeatureSmeWithdrawState,
    FrendsSmeWithdrawResponse,
    SmeWithdrawActionConstants,
    SmeWithdrawResponseStatus,
} from "../types/smeWithdraw.types";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchSmeWithdrawTrigger() {
    yield takeEvery(SmeWithdrawActionConstants.WITHDRAW_TRIGGER, handleSmeWithdrawTrigger);
}

export function* handleSmeWithdrawTrigger(
    action: ActionType<typeof smeWithdrawActions.withdrawTrigger>
) {
    try {
        const { token, mockApiCalls, gwUrl } = (yield select(
            (state: FeatureSmeWithdrawState) => state.withdraw.config
        )) as DefaultInitializerType;

        const accountId = yield select(
            (state: T_SmeLoan_FeatureAccountState) => state.account.activeAccountId
        );

        const response: FrendsSmeWithdrawResponse = yield call(smeWithdraw, {
            body: {
                appliedAmount: action.payload.appliedAmount,
                type: "CASH_WITHDRAWAL",
                channel: "MY_PAGES",
            },
            accountId,
            token,
            mockApiCalls,
            gwUrl,
        });

        if (response.status === SmeWithdrawResponseStatus.SUCCESS)
            yield put(smeWithdrawActions.withdrawSuccess(response));
        if (response.status === SmeWithdrawResponseStatus.ERROR)
            yield put(smeWithdrawActions.withdrawError(response));
        if (response.status === SmeWithdrawResponseStatus.NOT_FOUND)
            yield put(smeWithdrawActions.withdrawError(response));
        if (response.status === SmeWithdrawResponseStatus.UNAUTHORIZED)
            yield put(loginActions.loginCheckStatus());
    } catch (e) {
        logger.log("withdraw trigger failed");
    }
}
