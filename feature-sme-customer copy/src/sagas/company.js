"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchCompanyTrigger = watchCompanyTrigger;
exports.watchUpdateCompanyInfoTrigger = watchUpdateCompanyInfoTrigger;
exports.watchUpdateBankAccountNumberTrigger = watchUpdateBankAccountNumberTrigger;
exports.handleCompanyTrigger = handleCompanyTrigger;
exports.handleCompanyInfoUpdateTrigger = handleCompanyInfoUpdateTrigger;
exports.handleBankAccountUpdateTrigger = handleBankAccountUpdateTrigger;
const effects_1 = require("redux-saga/effects");
const types_1 = require("../types");
const actions_1 = require("../actions");
const api_1 = require("../api");
const company_1 = require("../api/company");
function* watchCompanyTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_CompanyActionConstants.GET_COMPANY_INFO_TRIGGER, handleCompanyTrigger);
}
function* watchUpdateCompanyInfoTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_CompanyActionConstants.UPDATE_COMPANY_INFO_TRIGGER, handleCompanyInfoUpdateTrigger);
}
function* watchUpdateBankAccountNumberTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_CompanyActionConstants.UPDATE_BANK_ACCOUNT_NUMBER_TRIGGER, handleBankAccountUpdateTrigger);
}
function* handleCompanyTrigger(action) {
    try {
        const smeId = action.payload.smeId;
        const config = yield (0, effects_1.select)((state) => {
            return state.customer.engagement.config;
        });
        const { mock, token, gwUrl } = config;
        const companyInfo = yield (0, effects_1.call)(api_1.fetchCompanyData, {
            mock,
            token,
            gwUrl,
            smeId,
        });
        if (companyInfo) {
            yield (0, effects_1.put)(actions_1.companyActions.getCompanyInfoSuccess(companyInfo));
        }
    }
    catch (e) {
        yield (0, effects_1.put)(actions_1.companyActions.getCompanyInfoError({
            message: "Engagement saga failed" + e,
        }));
    }
}
function* handleCompanyInfoUpdateTrigger(action) {
    try {
        const config = yield (0, effects_1.select)((state) => {
            return state.customer.engagement.config;
        });
        const { token, gwUrl } = config;
        const { smeId, phone, email, streetAddress, zipCode, city } = action.payload;
        const updateCompanyPayload = {
            smeId,
            phone,
            email,
            streetAddress,
            zipCode,
            city,
            gwUrl,
            token,
        };
        const result = yield (0, effects_1.call)(api_1.updateCompanyInfo, Object.assign({}, updateCompanyPayload));
        yield (0, effects_1.put)(actions_1.companyActions.updateCompanyInfoSuccess(action.payload));
    }
    catch (e) {
        throw new Error("Failed to update company info: " + e);
    }
}
function* handleBankAccountUpdateTrigger(action) {
    try {
        const config = yield (0, effects_1.select)((state) => {
            return state.customer.engagement.config;
        });
        const currentAccount = yield (0, effects_1.select)((state) => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ((_g = (_f = (_e = (_d = (_c = (_b = (_a = state === null || state === void 0 ? void 0 : state.customer) === null || _a === void 0 ? void 0 : _a.companyInfo) === null || _b === void 0 ? void 0 : _b.accounts) === null || _c === void 0 ? void 0 : _c.accounts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.disbursementAccount) === null || _f === void 0 ? void 0 : _f.externalAccountNumber) !== null && _g !== void 0 ? _g : "");
        });
        const { token, gwUrl } = config;
        const { accountId, number, type } = action.payload;
        const updateBankAccountPayload = {
            accountId,
            number,
            type,
            gwUrl,
            token,
            currentAccount,
        };
        const newAccountNumber = yield (0, effects_1.call)(company_1.updateOrCreateBankAccountNumber, Object.assign({}, updateBankAccountPayload));
        yield (0, effects_1.put)(actions_1.companyActions.updateBankAccountNumberSuccess(action.payload));
    }
    catch (e) {
        throw new Error("Failed to update company info: " + e);
    }
}
//# sourceMappingURL=company.js.map