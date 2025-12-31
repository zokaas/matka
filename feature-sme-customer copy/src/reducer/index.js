"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerReducer = void 0;
const redux_1 = require("redux");
const engagement_1 = require("./engagement");
const company_1 = require("./company");
const application_1 = require("./application");
exports.customerReducer = (0, redux_1.combineReducers)({
    engagement: engagement_1.engagementReducer,
    companyInfo: company_1.companyReducer,
    application: application_1.applicationReducer,
});
//# sourceMappingURL=index.js.map