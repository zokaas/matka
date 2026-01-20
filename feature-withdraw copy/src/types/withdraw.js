"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawResponseStatus = exports.WithdrawActionConstants = void 0;
var WithdrawActionConstants;
(function (WithdrawActionConstants) {
    WithdrawActionConstants["WITHDRAW_INITIALIZER"] = "WITHDRAW/INITIALIZER";
    WithdrawActionConstants["WITHDRAW_TRIGGER"] = "WITHDRAW/TRIGGER";
    WithdrawActionConstants["WITHDRAW_SUCCESS"] = "WITHDRAW/SUCCESS";
    WithdrawActionConstants["WITHDRAW_ERROR"] = "WITHDRAW/ERROR";
    WithdrawActionConstants["WITHDRAW_RESET"] = "WITHDRAW/RESET";
})(WithdrawActionConstants || (exports.WithdrawActionConstants = WithdrawActionConstants = {}));
var WithdrawResponseStatus;
(function (WithdrawResponseStatus) {
    WithdrawResponseStatus[WithdrawResponseStatus["INITIAL"] = 0] = "INITIAL";
    WithdrawResponseStatus[WithdrawResponseStatus["SUCCESS"] = 200] = "SUCCESS";
    WithdrawResponseStatus[WithdrawResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    WithdrawResponseStatus[WithdrawResponseStatus["ERROR"] = 500] = "ERROR";
})(WithdrawResponseStatus || (exports.WithdrawResponseStatus = WithdrawResponseStatus = {}));
//# sourceMappingURL=withdraw.js.map