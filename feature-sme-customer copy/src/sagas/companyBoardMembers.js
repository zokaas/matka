"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchCompanyBoardMembersTrigger = watchCompanyBoardMembersTrigger;
exports.handleCompanyBoardMembersTrigger = handleCompanyBoardMembersTrigger;
const effects_1 = require("redux-saga/effects");
const types_1 = require("../types");
const actions_1 = require("../actions");
const api_1 = require("../api");
function* watchCompanyBoardMembersTrigger() {
    yield (0, effects_1.takeEvery)(types_1.E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_TRIGGER, handleCompanyBoardMembersTrigger);
}
function* handleCompanyBoardMembersTrigger(action) {
    try {
        const smeId = action.payload.smeId;
        const config = yield (0, effects_1.select)((state) => {
            return state.customer.engagement.config;
        });
        const { mock, token, gwUrl } = config;
        const companyBoardMembers = yield (0, effects_1.call)(api_1.fetchCompanyBoardMembers, {
            mock,
            token,
            gwUrl,
            smeId,
        });
        if (companyBoardMembers) {
            yield (0, effects_1.put)(actions_1.companyActions.getCompanyBoardMembersSuccess(companyBoardMembers));
        }
    }
    catch (e) {
        yield (0, effects_1.put)(actions_1.companyActions.getCompanyBoardMembersError({
            message: "Board members saga failed" + e,
        }));
    }
}
//# sourceMappingURL=companyBoardMembers.js.map