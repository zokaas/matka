"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchKycTrigger = watchKycTrigger;
exports.handleKycTrigger = handleKycTrigger;
const effects_1 = require("redux-saga/effects");
const types_1 = require("../types");
const actions_1 = require("../actions");
const api_1 = require("../api");
const feature_sme_customer_1 = require("@opr-finance/feature-sme-customer");
function* watchKycTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_TRIGGER, handleKycTrigger);
}
function* handleKycTrigger(action) {
    try {
        console.log("handleKycTrigger", action.payload);
        const smeId = action.payload.smeId;
        const config = yield (0, effects_1.select)((state) => {
            return state.kyc.config;
        });
        const { mock, token, bffUrl, cid } = config;
        yield (0, effects_1.call)(api_1.triggerCreditSafeReport, Object.assign(Object.assign({ token, gwUrl: bffUrl, mockApiCalls: mock }, action.payload), { cid }));
        console.log("fetched creditsafe report, update company info");
        yield (0, effects_1.put)(feature_sme_customer_1.companyActions.getCompanyInfoTrigger({ smeId }));
        yield (0, effects_1.take)(feature_sme_customer_1.companyActions.getCompanyInfoSuccess);
        const company = yield (0, effects_1.select)((state) => state.customer.companyInfo.info);
        console.log("company updated: dynamicFields: ", company.dynamicFields);
        console.log("[KYC] CreditSafeReport success");
        yield (0, effects_1.put)(actions_1.kycActions.kycFetchCreditSafeReportSuccess({ isCsReportReady: true }));
    }
    catch (e) {
        console.log("action trigger failed", e);
    }
}
//# sourceMappingURL=kyc.sagas.js.map