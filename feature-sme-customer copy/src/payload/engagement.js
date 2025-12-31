"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessEngagements = void 0;
const getBusinessEngagements = (engagements) => {
    const businessIndividuals = engagements.engagements.filter((engagement) => engagement.engagementType === "BUSINESS_INDIVIDUAL");
    const filteredWithRoles = businessIndividuals.filter((item) => {
        var _a, _b;
        return ((_a = item.businessIndividual) === null || _a === void 0 ? void 0 : _a.roleType) === "boardMember" &&
            ((_b = item.businessIndividual) === null || _b === void 0 ? void 0 : _b.role) === "GUARANTOR";
    });
    return filteredWithRoles;
};
exports.getBusinessEngagements = getBusinessEngagements;
//# sourceMappingURL=engagement.js.map