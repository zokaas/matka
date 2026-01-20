"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smeWithdrawActions = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const smeWithdraw_types_1 = require("../types/smeWithdraw.types");
exports.smeWithdrawActions = {
    withdrawInitializer: (0, typesafe_actions_1.createAction)(smeWithdraw_types_1.SmeWithdrawActionConstants.WITHDRAW_INITIALIZER)(),
    withdrawTrigger: (0, typesafe_actions_1.createAction)(smeWithdraw_types_1.SmeWithdrawActionConstants.WITHDRAW_TRIGGER)(),
    withdrawSuccess: (0, typesafe_actions_1.createAction)(smeWithdraw_types_1.SmeWithdrawActionConstants.WITHDRAW_SUCCESS)(),
    withdrawError: (0, typesafe_actions_1.createAction)(smeWithdraw_types_1.SmeWithdrawActionConstants.WITHDRAW_ERROR)(),
    withdrawReset: (0, typesafe_actions_1.createAction)(smeWithdraw_types_1.SmeWithdrawActionConstants.WITHDRAW_RESET)(),
};
//# sourceMappingURL=smeWithdraw.action.js.map