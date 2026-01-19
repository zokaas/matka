"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKyc = exports.initiateKycFlowWithSession = void 0;
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const cacheData_1 = require("../api/cacheData");
const kycParams_1 = require("./kycParams");
const clearSessionStorage_1 = require("./clearSessionStorage");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
const initiateKycFlowWithSession = (kycParams) => __awaiter(void 0, void 0, void 0, function* () {
    const kycCacheId = yield (0, cacheData_1.saveData)(kycParams);
    if (!kycCacheId) {
        logger.log("error");
        throw new Error("Failed to save KYC data, no cache id");
    }
    logger.log("kycCacheId", kycCacheId);
    const success = yield handleKycRedirect(kycCacheId);
    if (success) {
        (0, clearSessionStorage_1.clearSessionStorage)();
    }
    else {
        logger.error("KYC redirect failed");
    }
});
exports.initiateKycFlowWithSession = initiateKycFlowWithSession;
const handleKycRedirect = (kycCacheId) => __awaiter(void 0, void 0, void 0, function* () {
    const kycFormBaseUrl = process.env.REACT_APP_KYC_FORM_URL;
    if (!kycFormBaseUrl) {
        logger.error("Missing KYC form base URL");
        return false;
    }
    const kycServiceUrl = new URL(kycFormBaseUrl);
    kycServiceUrl.searchParams.set("key", kycCacheId);
    setTimeout(() => {
        logger.log("handleKycRedirect - Redirecting now...");
        window.location.href = kycServiceUrl.toString();
    }, 100);
    logger.log("redirect OK!");
    return true;
});
const startKyc = (company, session, flow) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, kycParams_1.mapKycParams)(company, session, flow);
    if (!params)
        return false;
    yield (0, exports.initiateKycFlowWithSession)(params);
    return true;
});
exports.startKyc = startKyc;
//# sourceMappingURL=kycFlowWithSession.js.map