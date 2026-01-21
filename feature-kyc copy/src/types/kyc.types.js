"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycFlow = exports.E_KycActionConstants = void 0;
var E_KycActionConstants;
(function (E_KycActionConstants) {
    E_KycActionConstants["KYC_INITIALIZEER"] = "KYC_INITIALIZEER";
    E_KycActionConstants["KYC_FETCH_CREDIT_SAFE_REPORT_TRIGGER"] = "KYC/FETCH_COMPANY_TRIGGER";
    E_KycActionConstants["KYC_FETCH_CREDIT_SAFE_REPORT_SUCCESS"] = "KYC/FETCH_COMPANY_SUCCESS";
    E_KycActionConstants["UPDATE_KYC_STATE"] = "UPDATE_KYC_STATE";
    E_KycActionConstants["KYC_SHOW_MODAL"] = "KYC/SHOW_MODAL";
    E_KycActionConstants["KYC_HIDE_MODAL"] = "KYC/HIDE_MODAL";
    E_KycActionConstants["KYC_START_FLOW_TRIGGER"] = "KYC/START_FLOW_TRIGGER";
    E_KycActionConstants["KYC_START_FLOW_SUCCESS"] = "KYC/START_FLOW_SUCCESS";
})(E_KycActionConstants || (exports.E_KycActionConstants = E_KycActionConstants = {}));
exports.kycFlow = {
    NEW_CUSTOMER: "new_customer",
    EXISTING_CUSTOMER: "existing_customer",
};
//# sourceMappingURL=kyc.types.js.map