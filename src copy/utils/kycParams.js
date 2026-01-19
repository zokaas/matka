"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCompanyDataForKyc = exports.mapKycParams = void 0;
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const kyc_1 = require("../types/kyc");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
const flexOnlineBaseUrl = process.env.REACT_APP_FLEX_ONLINE_BASEURL;
const mapKycParams = (company, session, flow) => {
    var _a;
    logger.log("mapKycParams", company, session);
    if (!company || !session)
        return null;
    const { orgNumber, companyName, sniCode } = company;
    const { exp, sessionRefreshCount, maxSessionRefresh, gtm_userId, auth } = session;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const sessionId = (_a = localStorage.getItem("token")) !== null && _a !== void 0 ? _a : "";
    const applicationId = "11111";
    const missing = {
        organizationNumber: !orgNumber,
        companyName: !companyName,
        sessionId: !sessionId,
        clientId: !clientId,
        exp: typeof exp !== "number",
        sessionRefreshCount: typeof sessionRefreshCount !== "number",
        maxSessionRefresh: typeof maxSessionRefresh !== "number",
    };
    const missingKeys = Object.entries(missing)
        .filter(([_, isMissing]) => isMissing)
        .map(([key]) => key);
    if (missingKeys.length > 0) {
        logger.error("Missing or invalid KYC parameters:", {
            missingFields: missingKeys,
        });
        return null;
    }
    return {
        applicationId,
        clientId,
        kycType: kyc_1.kycType.ONBOARDING,
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
};
exports.mapKycParams = mapKycParams;
const mapCompanyDataForKyc = (company) => {
    var _a, _b, _c;
    return {
        orgNumber: (_a = company === null || company === void 0 ? void 0 : company.organizationNumber) !== null && _a !== void 0 ? _a : "",
        companyName: (_b = company === null || company === void 0 ? void 0 : company.companyName) !== null && _b !== void 0 ? _b : "",
        sniCode: (_c = company === null || company === void 0 ? void 0 : company.industryCode) !== null && _c !== void 0 ? _c : "",
    };
};
exports.mapCompanyDataForKyc = mapCompanyDataForKyc;
//# sourceMappingURL=kycParams.js.map