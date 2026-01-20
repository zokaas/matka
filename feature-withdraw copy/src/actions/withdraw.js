"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawActions = void 0;
const withdraw_1 = require("../types/withdraw");
const typesafe_actions_1 = require("typesafe-actions");
exports.withdrawActions = {
    withdrawInitializer: (0, typesafe_actions_1.createAction)(withdraw_1.WithdrawActionConstants.WITHDRAW_INITIALIZER)(),
    withdrawTrigger: (0, typesafe_actions_1.createAction)(withdraw_1.WithdrawActionConstants.WITHDRAW_TRIGGER)(),
    withdrawSuccess: (0, typesafe_actions_1.createAction)(withdraw_1.WithdrawActionConstants.WITHDRAW_SUCCESS)(),
    withdrawError: (0, typesafe_actions_1.createAction)(withdraw_1.WithdrawActionConstants.WITHDRAW_ERROR)(),
    withdrawReset: (0, typesafe_actions_1.createAction)(withdraw_1.WithdrawActionConstants.WITHDRAW_RESET)(),
};
//# sourceMappingURL=withdraw.js.map