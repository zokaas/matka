"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycType = exports.kycRedirectPath = exports.kycFlow = void 0;
exports.kycFlow = {
    NEW_CUSTOMER: "new_customer",
    EXISTING_CUSTOMER: "existing_customer",
};
exports.kycRedirectPath = {
    [exports.kycFlow.NEW_CUSTOMER]: "thank-you",
    [exports.kycFlow.EXISTING_CUSTOMER]: "front",
};
exports.kycType = {
    ONBOARDING: "onboarding",
    UPDATING: "updating",
};
//# sourceMappingURL=kyc.js.map