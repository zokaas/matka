"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSmeApplicationTrigger = watchSmeApplicationTrigger;
exports.handleApplicationTrigger = handleApplicationTrigger;
const effects_1 = require("redux-saga/effects");
const types_1 = require("../types");
const api_1 = require("../api");
const actions_1 = require("../actions");
function* watchSmeApplicationTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_ApplicationActionConstants.GET_APPLICATION_TRIGGER, handleApplicationTrigger);
}
function* handleApplicationTrigger() {
    try {
        const config = yield (0, effects_1.select)((state) => {
            return state.customer.application.config;
        });
        const { mock, token, gwUrl } = config;
        const appId = sessionStorage.getItem("applicationId") || "";
        if (!appId)
            yield (0, effects_1.put)(actions_1.applicationActions.applicationError({ message: "Application id not found" }));
        const data = {
            mock,
            token,
            gwUrl,
            appId,
        };
        const application = (yield (0, effects_1.call)(api_1.fetchSmeApplication, data));
        if (application) {
            const { smeId } = application;
            yield (0, effects_1.put)(actions_1.companyActions.getCompanyInfoTrigger({ smeId }));
            yield (0, effects_1.put)(actions_1.applicationActions.applicationSuccess(application));
        }
    }
    catch (e) {
        yield (0, effects_1.put)(actions_1.applicationActions.applicationError({ message: "Application saga failed" + e }));
    }
}
//# sourceMappingURL=application.js.map