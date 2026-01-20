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
exports.triggerCreditSafeReport = triggerCreditSafeReport;
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
function triggerCreditSafeReport(data) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.log("trigger fetch CreditSafe report ", data);
        const url = `${data.gwUrl}/broker-proxy/creditSafe/${data.cid}/${data.applicationId}/${data.companyId}/${data.smeId}`;
        const method = "GET";
        const response = yield fetch(url, {
            method,
            headers: {
                "content-type": "application/json",
                authorization: data.token,
            },
        });
        if (!response.ok) {
            logger.error("failed to trigger fetch CreditSafe report", response.status);
            throw new Error(`Broker-proxy API error: ${response.status}`);
        }
        const result = yield response.json();
        logger.log("fetchCreditSafeReport", result);
        return result;
    });
}
//# sourceMappingURL=triggerCreditSafeReport.js.map