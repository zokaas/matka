"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmeWithdrawResponseStatus = exports.SmeWithdrawActionConstants = void 0;
var SmeWithdrawActionConstants;
(function (SmeWithdrawActionConstants) {
    SmeWithdrawActionConstants["WITHDRAW_INITIALIZER"] = "WITHDRAW/INITIALIZER";
    SmeWithdrawActionConstants["WITHDRAW_TRIGGER"] = "WITHDRAW/TRIGGER";
    SmeWithdrawActionConstants["WITHDRAW_SUCCESS"] = "WITHDRAW/SUCCESS";
    SmeWithdrawActionConstants["WITHDRAW_ERROR"] = "WITHDRAW/ERROR";
    SmeWithdrawActionConstants["WITHDRAW_RESET"] = "WITHDRAW/RESET";
})(SmeWithdrawActionConstants || (exports.SmeWithdrawActionConstants = SmeWithdrawActionConstants = {}));
var SmeWithdrawResponseStatus;
(function (SmeWithdrawResponseStatus) {
    SmeWithdrawResponseStatus[SmeWithdrawResponseStatus["INITIAL"] = 0] = "INITIAL";
    SmeWithdrawResponseStatus[SmeWithdrawResponseStatus["SUCCESS"] = 201] = "SUCCESS";
    SmeWithdrawResponseStatus[SmeWithdrawResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    SmeWithdrawResponseStatus[SmeWithdrawResponseStatus["ERROR"] = 500] = "ERROR";
    SmeWithdrawResponseStatus[SmeWithdrawResponseStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
})(SmeWithdrawResponseStatus || (exports.SmeWithdrawResponseStatus = SmeWithdrawResponseStatus = {}));
//# sourceMappingURL=smeWithdraw.types.js.map