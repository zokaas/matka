"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSmeApplicationTrigger = exports.watchCompanyBoardMembersTrigger = exports.watchCompanyAccountsTrigger = exports.watchUpdateBankAccountNumberTrigger = exports.watchUpdateCompanyInfoTrigger = exports.watchCompanyTrigger = exports.watchEngagementTrigger = void 0;
var engagements_1 = require("./engagements");
Object.defineProperty(exports, "watchEngagementTrigger", { enumerable: true, get: function () { return engagements_1.watchEngagementTrigger; } });
var company_1 = require("./company");
Object.defineProperty(exports, "watchCompanyTrigger", { enumerable: true, get: function () { return company_1.watchCompanyTrigger; } });
Object.defineProperty(exports, "watchUpdateCompanyInfoTrigger", { enumerable: true, get: function () { return company_1.watchUpdateCompanyInfoTrigger; } });
Object.defineProperty(exports, "watchUpdateBankAccountNumberTrigger", { enumerable: true, get: function () { return company_1.watchUpdateBankAccountNumberTrigger; } });
var companyAccounts_1 = require("./companyAccounts");
Object.defineProperty(exports, "watchCompanyAccountsTrigger", { enumerable: true, get: function () { return companyAccounts_1.watchCompanyAccountsTrigger; } });
var companyBoardMembers_1 = require("./companyBoardMembers");
Object.defineProperty(exports, "watchCompanyBoardMembersTrigger", { enumerable: true, get: function () { return companyBoardMembers_1.watchCompanyBoardMembersTrigger; } });
var application_1 = require("./application");
Object.defineProperty(exports, "watchSmeApplicationTrigger", { enumerable: true, get: function () { return application_1.watchSmeApplicationTrigger; } });
//# sourceMappingURL=index.js.map