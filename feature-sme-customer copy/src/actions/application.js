"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationActions = void 0;
const typesafe_actions_1 = require("typesafe-actions");
const types_1 = require("../types");
exports.applicationActions = {
    applicationInitializer: (0, typesafe_actions_1.createAction)(types_1.E_ApplicationActionConstants.GET_APPLICATION_INITIALIZEER)(),
    applicationTrigger: (0, typesafe_actions_1.createAction)(types_1.E_ApplicationActionConstants.GET_APPLICATION_TRIGGER)(),
    applicationSuccess: (0, typesafe_actions_1.createAction)(types_1.E_ApplicationActionConstants.GET_APPLICATION_SUCCESS)(),
    applicationError: (0, typesafe_actions_1.createAction)(types_1.E_ApplicationActionConstants.GET_APPLICATION_ERROR)(),
};
//# sourceMappingURL=application.js.map