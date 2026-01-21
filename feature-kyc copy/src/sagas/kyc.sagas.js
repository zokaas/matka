"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchKycStartFlowTrigger = watchKycStartFlowTrigger;
exports.handleKycStartFlow = handleKycStartFlow;
const effects_1 = require("redux-saga/effects");
const types_1 = require("../types");
const actions_1 = require("../actions");
const api_1 = require("../api");
const feature_sme_customer_1 = require("@opr-finance/feature-sme-customer");
function* watchKycStartFlowTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_KycActionConstants.KYC_START_FLOW_TRIGGER, handleKycStartFlow);
}
function* handleKycStartFlow(action) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        console.log("handleKycStartFlow", action.payload);
        const { applicationId, smeId, companyId, flow } = action.payload;
        let company;
        if (flow === types_1.kycFlow.EXISTING_CUSTOMER) {
            const config = yield (0, effects_1.select)((state) => state.kyc.config);
            const { mock, token, bffUrl, cid } = config;
            yield (0, effects_1.call)(api_1.triggerCreditSafeReport, {
                token,
                gwUrl: bffUrl,
                mockApiCalls: mock,
                applicationId,
                smeId,
                companyId,
                cid,
            });
            yield (0, effects_1.put)(feature_sme_customer_1.companyActions.getCompanyInfoTrigger({ smeId }));
            yield (0, effects_1.take)(feature_sme_customer_1.companyActions.getCompanyInfoSuccess);
            company = yield (0, effects_1.select)((state) => state.customer.companyInfo.info);
            console.log("[KYC] Company refreshed, industryCode:", (_b = (_a = company.dynamicFields) === null || _a === void 0 ? void 0 : _a.kyc) === null || _b === void 0 ? void 0 : _b.industryCode);
        }
        else {
            company = yield (0, effects_1.select)((state) => state.customer.companyInfo.info);
        }
        const session = yield (0, effects_1.select)((state) => state.session);
        const companyData = {
            orgNumber: (_c = company.organizationNumber) !== null && _c !== void 0 ? _c : "",
            companyName: (_d = company.companyName) !== null && _d !== void 0 ? _d : "",
            sniCode: (_g = (_f = (_e = company.dynamicFields) === null || _e === void 0 ? void 0 : _e.kyc) === null || _f === void 0 ? void 0 : _f.industryCode) !== null && _g !== void 0 ? _g : "",
        };
        yield (0, effects_1.call)(initiateKycRedirect, companyData, session, flow, applicationId);
        yield (0, effects_1.put)(actions_1.kycActions.kycStartFlowSuccess());
    }
    catch (e) {
        console.log("[KYC] Start flow failed", e);
    }
}
function* initiateKycRedirect(company, session, flow, applicationId) {
    var _a;
    const { exp, sessionRefreshCount, maxSessionRefresh, gtm_userId, auth } = session;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const sessionId = (_a = localStorage.getItem("token")) !== null && _a !== void 0 ? _a : "";
    const bffUrl = process.env.REACT_APP_BFF_URL;
    const kycFormBaseUrl = process.env.REACT_APP_KYC_FORM_URL;
    const kycParams = {
        applicationId,
        clientId,
        kycType: "onboarding",
        kycFlow: flow,
        company,
        session: {
            kcUserId: gtm_userId,
            sessionId,
            exp: exp * 1000,
            sessionRefreshCount,
            maxSessionRefresh,
        },
        auth,
    };
    const response = yield (0, effects_1.call)(fetch, `${bffUrl}/cache/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kycParams),
    });
    const result = yield (0, effects_1.call)([response, "json"]);
    const kycCacheId = result.redisKey;
    if (!kycCacheId) {
        throw new Error("Failed to save KYC data, no cache id");
    }
    console.log("[KYC] Cache saved, redirecting...", kycCacheId);
    sessionStorage.clear();
    const kycServiceUrl = new URL(kycFormBaseUrl);
    kycServiceUrl.searchParams.set("key", kycCacheId);
    window.location.href = kycServiceUrl.toString();
}
//# sourceMappingURL=kyc.sagas.js.map