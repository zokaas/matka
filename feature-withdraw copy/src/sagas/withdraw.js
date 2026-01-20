"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchWithdrawTrigger = watchWithdrawTrigger;
exports.handleWithdrawTrigger = handleWithdrawTrigger;
const effects_1 = require("redux-saga/effects");
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const feature_lfp_login_1 = require("@opr-finance/feature-lfp-login");
const withdraw_1 = require("../actions/withdraw");
const withdraw_2 = require("../types/withdraw");
const withdraw_3 = require("../api/withdraw");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
function* watchWithdrawTrigger() {
    yield (0, effects_1.takeEvery)(withdraw_2.WithdrawActionConstants.WITHDRAW_TRIGGER, handleWithdrawTrigger);
}
function* handleWithdrawTrigger(action) {
    yield (0, effects_1.delay)(1000);
    try {
        const { token, mockApiCalls, gwUrl } = (yield (0, effects_1.select)((state) => state.withdraw.config));
        const response = yield (0, effects_1.call)(withdraw_3.withdraw, {
            body: {
                phoneNumber: action.payload.phoneNumber,
                amount: `${action.payload.amount}`,
            },
            token,
            mockApiCalls,
            gwUrl,
        });
        if (response.status === withdraw_2.WithdrawResponseStatus.SUCCESS)
            yield (0, effects_1.put)(withdraw_1.withdrawActions.withdrawSuccess(response));
        if (response.status === withdraw_2.WithdrawResponseStatus.ERROR)
            yield (0, effects_1.put)(withdraw_1.withdrawActions.withdrawError(response));
        if (response.status === withdraw_2.WithdrawResponseStatus.UNAUTHORIZED)
            yield (0, effects_1.put)(feature_lfp_login_1.loginActions.loginCheckStatus());
    }
    catch (e) {
        logger.log("withdraw trigger failed");
    }
}
//# sourceMappingURL=withdraw.js.map