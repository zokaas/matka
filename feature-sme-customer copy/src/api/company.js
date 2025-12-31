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
exports.fetchCompanyData = fetchCompanyData;
exports.updateCompanyInfo = updateCompanyInfo;
exports.updateOrCreateBankAccountNumber = updateOrCreateBankAccountNumber;
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
function fetchCompanyData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${data.gwUrl}/api/customer/v6/smes/${data.smeId}`;
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
                logger.log("MOCK DATA - COMPANY DATA");
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
            throw new Error("Fetching company-info failed");
        }
    });
}
function updateCompanyInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `${data.gwUrl}/update/profile/api/customer/v6/smes/${data.smeId}`;
            const method = "PATCH";
            const { token, phone, email, streetAddress, zipCode, city } = data;
            const bodyData = {
                phone,
                email,
                officialAddress: {
                    streetAddress,
                    zipCode,
                    city,
                },
            };
            const result = yield fetch(url, {
                method,
                headers: {
                    "content-type": "application/json",
                    authorization: token,
                },
                body: JSON.stringify(bodyData),
            });
            if (result.status === 200) {
                return result.json();
            }
        }
        catch (error) {
            throw new Error("Error fetching update profile request:" + error);
        }
    });
}
function updateOrCreateBankAccountNumber(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const currentAccount = (_b = (_a = data.currentAccount) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
            const isCreate = !currentAccount || currentAccount === "";
            const baseUrl = `/api/loan/v8/accounts/${data.accountId}/disbursementAccount`;
            const url = `${data.gwUrl}/${isCreate ? "create" : "update"}/bankaccount${baseUrl}`;
            const method = isCreate ? "POST" : "PUT";
            const { token, type, number } = data;
            const bodyData = {
                type,
                number,
            };
            const result = yield fetch(url, {
                method,
                headers: {
                    "content-type": "application/json",
                    authorization: token,
                },
                body: JSON.stringify(bodyData),
            });
            if (result.status === 200 || result.status === 201) {
                return result.json();
            }
        }
        catch (error) {
            throw new Error("Updating bank account number failed:" + error);
        }
    });
}
//# sourceMappingURL=company.js.map