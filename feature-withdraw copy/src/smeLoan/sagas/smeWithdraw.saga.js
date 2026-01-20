"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSmeWithdrawTrigger = watchSmeWithdrawTrigger;
exports.handleSmeWithdrawTrigger = handleSmeWithdrawTrigger;
const effects_1 = require("redux-saga/effects");
const smeWithdraw_api_1 = require("../api/smeWithdraw.api");
const feature_lfp_login_1 = require("@opr-finance/feature-lfp-login");
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const smeWithdraw_action_1 = require("../actions/smeWithdraw.action");
const smeWithdraw_types_1 = require("../types/smeWithdraw.types");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
function* watchSmeWithdrawTrigger() {
    yield (0, effects_1.takeEvery)(smeWithdraw_types_1.SmeWithdrawActionConstants.WITHDRAW_TRIGGER, handleSmeWithdrawTrigger);
}
function* handleSmeWithdrawTrigger(action) {
    try {
        const { token, mockApiCalls, gwUrl } = (yield (0, effects_1.select)((state) => state.withdraw.config));
        const accountId = yield (0, effects_1.select)((state) => state.account.activeAccountId);
        const response = yield (0, effects_1.call)(smeWithdraw_api_1.smeWithdraw, {
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
        if (response.status === smeWithdraw_types_1.SmeWithdrawResponseStatus.SUCCESS)
            yield (0, effects_1.put)(smeWithdraw_action_1.smeWithdrawActions.withdrawSuccess(response));
        if (response.status === smeWithdraw_types_1.SmeWithdrawResponseStatus.ERROR)
            yield (0, effects_1.put)(smeWithdraw_action_1.smeWithdrawActions.withdrawError(response));
        if (response.status === smeWithdraw_types_1.SmeWithdrawResponseStatus.NOT_FOUND)
            yield (0, effects_1.put)(smeWithdraw_action_1.smeWithdrawActions.withdrawError(response));
        if (response.status === smeWithdraw_types_1.SmeWithdrawResponseStatus.UNAUTHORIZED)
            yield (0, effects_1.put)(feature_lfp_login_1.loginActions.loginCheckStatus());
    }
    catch (e) {
        logger.log("withdraw trigger failed");
    }
}
//# sourceMappingURL=smeWithdraw.saga.js.map