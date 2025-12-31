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
exports.fetchSmeApplication = fetchSmeApplication;
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
function fetchSmeApplication(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${data.gwUrl}/api/loan/v8/applications/${data.appId}`;
        const method = "GET";
        const { token, mock } = data;
        try {
            const result = yield fetch(url, {
                method,
                headers: {
                    "content-type": "application/json",
                    authorization: token,
                },
            });
            const response = yield result.json();
            if (mock) {
                logger.log("MOCK DATA - SME_APPLICATION");
                logger.log(response);
            }
            if (result.status === 200) {
                return response;
            }
            else {
                throw new Error();
            }
        }
        catch (error) {
            throw new Error("Fetching application failed");
        }
    });
}
//# sourceMappingURL=application.js.map