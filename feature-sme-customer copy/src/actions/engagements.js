"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engagementActions = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const types_1 = require("../types");
exports.engagementActions = {
    engagementInitializer: (0, typesafe_actions_1.createAction)(types_1.E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER)(),
    engagementTrigger: (0, typesafe_actions_1.createAction)(types_1.E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER)(),
    engagementSuccess: (0, typesafe_actions_1.createAction)(types_1.E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS)(),
    engagementError: (0, typesafe_actions_1.createAction)(types_1.E_EngagementActionConstants.GET_ENGAGEMENT_ERROR)(),
    saveSmeIdSuccess: (0, typesafe_actions_1.createAction)(types_1.E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS)(),
};
//# sourceMappingURL=engagements.js.map