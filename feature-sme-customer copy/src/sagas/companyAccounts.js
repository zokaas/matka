"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchCompanyAccountsTrigger = watchCompanyAccountsTrigger;
exports.handleCompanyAccountsTrigger = handleCompanyAccountsTrigger;
const effects_1 = require("redux-saga/effects");
const types_1 = require("../types");
const actions_1 = require("../actions");
const api_1 = require("../api");
function* watchCompanyAccountsTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_TRIGGER, handleCompanyAccountsTrigger);
}
function* handleCompanyAccountsTrigger(action) {
    try {
        const smeId = action.payload.smeId;
        const config = yield (0, effects_1.select)((state) => {
            return state.customer.engagement.config;
        });
        const { mock, token, gwUrl } = config;
        const companyAccounts = yield (0, effects_1.call)(api_1.fetchCompanyAccounts, {
            mock,
            token,
            gwUrl,
            smeId,
        });
        if (companyAccounts) {
            yield (0, effects_1.put)(actions_1.companyActions.getCompanyAccountsSuccess(companyAccounts));
        }
    }
    catch (e) {
        yield (0, effects_1.put)(actions_1.companyActions.getCompanyAccountsError({
            message: "Company accounts saga failed" + e,
        }));
    }
}
//# sourceMappingURL=companyAccounts.js.map