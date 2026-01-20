"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycActions = exports.E_KycActionConstants = void 0;
const typesafe_actions_1 = require("typesafe-actions");
var E_KycActionConstants;
(function (E_KycActionConstants) {
    E_KycActionConstants["SHOW_MODAL"] = "FEATURE/KYC/SHOW_MODAL";
    E_KycActionConstants["HIDE_MODAL"] = "FEATURE/KYC/HIDE_MODAL";
    E_KycActionConstants["VALIDATION_START"] = "FEATURE/KYC/VALIDATION_START";
    E_KycActionConstants["VALIDATION_SUCCESS"] = "FEATURE/KYC/VALIDATION_SUCCESS";
    E_KycActionConstants["VALIDATION_FAILED"] = "FEATURE/KYC/VALIDATION_FAILED";
})(E_KycActionConstants || (exports.E_KycActionConstants = E_KycActionConstants = {}));
exports.kycActions = {
    showModal: (0, typesafe_actions_1.createAction)(E_KycActionConstants.SHOW_MODAL)(),
    hideModal: (0, typesafe_actions_1.createAction)(E_KycActionConstants.HIDE_MODAL)(),
    validationStart: (0, typesafe_actions_1.createAction)(E_KycActionConstants.VALIDATION_START)(),
    validationSuccess: (0, typesafe_actions_1.createAction)(E_KycActionConstants.VALIDATION_SUCCESS)(),
    validationFailed: (0, typesafe_actions_1.createAction)(E_KycActionConstants.VALIDATION_FAILED)(),
};
//# sourceMappingURL=actions.js.map