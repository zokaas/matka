"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchEngagementTrigger = watchEngagementTrigger;
exports.handleEngagementTrigger = handleEngagementTrigger;
const effects_1 = require("redux-saga/effects");
const types_1 = require("../types");
const engagements_1 = require("../api/engagements");
const actions_1 = require("../actions");
const engagement_1 = require("../payload/engagement");
function* watchEngagementTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER, handleEngagementTrigger);
}
function* handleEngagementTrigger() {
    try {
        const config = yield (0, effects_1.select)((state) => {
            return state.customer.engagement.config;
        });
        const { mock, token, gwUrl, role, reference, refType } = config;
        const referenceType = refType !== null && refType !== void 0 ? refType : "SSN";
        let engagements;
        if (role === "act-as-customer") {
            engagements = yield (0, effects_1.call)(engagements_1.fetchEngagementsActAsCustomer, {
                mock,
                token,
                gwUrl,
                role,
                ssn: reference,
                refType: referenceType,
            });
        }
        else {
            engagements = yield (0, effects_1.call)(engagements_1.fetchEngagements, {
                mock,
                token,
                gwUrl,
                role,
                refType,
            });
        }
        if (engagements) {
            const payload = (0, engagement_1.getBusinessEngagements)(engagements);
            yield (0, effects_1.put)(actions_1.engagementActions.engagementSuccess(payload));
        }
    }
    catch (e) {
        yield (0, effects_1.put)(actions_1.engagementActions.engagementError({ message: "Engagements saga failed" + e }));
    }
}
//# sourceMappingURL=engagements.js.map