"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycActions = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const types_1 = require("../types");
exports.kycActions = {
    kycInitializer: (0, typesafe_actions_1.createAction)(types_1.E_KycActionConstants.KYC_INITIALIZEER)(),
    kycFetchCreditSafeReportTrigger: (0, typesafe_actions_1.createAction)(types_1.E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_TRIGGER)(),
    kycFetchCreditSafeReportSuccess: (0, typesafe_actions_1.createAction)(types_1.E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_SUCCESS)(),
    updateKycState: (0, typesafe_actions_1.createAction)(types_1.E_KycActionConstants.UPDATE_KYC_STATE)(),
};
//# sourceMappingURL=kyc.actions.js.map