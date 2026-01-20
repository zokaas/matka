"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKycDeadlineDays = exports.getKycDataFromApplication = exports.formatDeadlineDate = exports.getKycDeadlineDate = exports.isKycDeadlinePassed = exports.getDaysSinceKycUpdate = exports.hasKycBeenFilled = exports.isApplicationStatusValid = void 0;
const isApplicationStatusValid = (applicationChannel, applicationState) => {
    if (applicationChannel === "BROKER") {
        return applicationState === "PN_CREATED";
    }
    else {
        return applicationState === "PENDING" || applicationState === "PN_CREATED";
    }
};
exports.isApplicationStatusValid = isApplicationStatusValid;
const hasKycBeenFilled = (kycUpdatedDate) => {
    return !!kycUpdatedDate && kycUpdatedDate.trim() !== "";
};
exports.hasKycBeenFilled = hasKycBeenFilled;
const getDaysSinceKycUpdate = (kycUpdatedDate) => {
    if (!kycUpdatedDate)
        return Infinity;
    const kycDate = new Date(kycUpdatedDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - kycDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
exports.getDaysSinceKycUpdate = getDaysSinceKycUpdate;
const isKycDeadlinePassed = (kycUpdatedDate, deadlineDays) => {
    if (!kycUpdatedDate) {
        return false;
    }
    const daysSinceUpdate = (0, exports.getDaysSinceKycUpdate)(kycUpdatedDate);
    return daysSinceUpdate > deadlineDays;
};
exports.isKycDeadlinePassed = isKycDeadlinePassed;
const getKycDeadlineDate = (deadlineDays) => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineDays);
    return deadline;
};
exports.getKycDeadlineDate = getKycDeadlineDate;
const formatDeadlineDate = (date) => {
    return date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
exports.formatDeadlineDate = formatDeadlineDate;
const getKycDataFromApplication = (application) => {
    var _a;
    if (!((_a = application === null || application === void 0 ? void 0 : application.dynamicFields) === null || _a === void 0 ? void 0 : _a.kyc)) {
        return {
            kycDone: false,
            kycUpdatedDate: undefined,
            hasKyc: false,
        };
    }
    const { kycDone, kycUpdatedDate, redirectUrl, riskScore, riskClassification, industryCode } = application.dynamicFields.kyc;
    return {
        kycDone: kycDone || false,
        kycUpdatedDate,
        hasKyc: (0, exports.hasKycBeenFilled)(kycUpdatedDate),
        redirectUrl,
        riskScore,
        riskClassification,
        industryCode,
    };
};
exports.getKycDataFromApplication = getKycDataFromApplication;
const getKycDeadlineDays = () => {
    const deadline = process.env.REACT_APP_KYC_DEADLINE_DAYS || "30";
    return parseInt(deadline, 10);
};
exports.getKycDeadlineDays = getKycDeadlineDays;
//# sourceMappingURL=kyc-utils.js.map