"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearKycModalDismissal = exports.dismissKycModal = exports.shouldBlockWithdrawal = exports.checkKycStatus = exports.getKycDeadlineDate = exports.KYC_WARNING_DAYS = exports.KYC_MODAL_DISMISS_KEY = void 0;
const date_fns_1 = require("date-fns");
exports.KYC_MODAL_DISMISS_KEY = "kycModalDismissed";
exports.KYC_WARNING_DAYS = 14;
const getKycDeadlineDate = () => {
    const envDeadline = "2026-01-15";
    return envDeadline || null;
};
exports.getKycDeadlineDate = getKycDeadlineDate;
const checkKycStatus = (kycState) => {
    const { kycDone, kycDueDate } = kycState;
    const today = new Date();
    if (kycDueDate && kycDueDate !== '') {
        const dueDate = (0, date_fns_1.parseISO)(kycDueDate);
        const daysRemaining = (0, date_fns_1.differenceInDays)(dueDate, today);
        const dismissed = sessionStorage.getItem(exports.KYC_MODAL_DISMISS_KEY);
        if (dismissed === "true") {
            return {
                shouldShowModal: false,
                isOverdue: daysRemaining < 0,
                daysRemaining,
                reason: "dismissed",
            };
        }
        if (daysRemaining < 0) {
            return {
                shouldShowModal: true,
                isOverdue: true,
                daysRemaining,
                reason: kycDone ? "renewal_overdue" : "overdue",
            };
        }
        if (daysRemaining <= exports.KYC_WARNING_DAYS) {
            return {
                shouldShowModal: true,
                isOverdue: false,
                daysRemaining,
                reason: kycDone ? "renewal_approaching" : "approaching_deadline",
            };
        }
        return {
            shouldShowModal: false,
            isOverdue: false,
            daysRemaining,
            reason: "completed",
        };
    }
    const deadlineDate = (0, exports.getKycDeadlineDate)();
    if (!deadlineDate) {
        return {
            shouldShowModal: false,
            isOverdue: false,
            daysRemaining: null,
            reason: "not_yet",
        };
    }
    const hardDeadline = (0, date_fns_1.parseISO)(deadlineDate);
    const daysRemaining = (0, date_fns_1.differenceInDays)(hardDeadline, today);
    const dismissed = sessionStorage.getItem(exports.KYC_MODAL_DISMISS_KEY);
    if (dismissed === "true") {
        return {
            shouldShowModal: false,
            isOverdue: daysRemaining < 0,
            daysRemaining,
            reason: "dismissed",
            effectiveDueDate: deadlineDate,
        };
    }
    if (daysRemaining < 0) {
        return {
            shouldShowModal: true,
            isOverdue: true,
            daysRemaining,
            reason: "no_due_date",
            effectiveDueDate: deadlineDate,
        };
    }
    if (daysRemaining <= exports.KYC_WARNING_DAYS) {
        return {
            shouldShowModal: true,
            isOverdue: false,
            daysRemaining,
            reason: "no_due_date",
            effectiveDueDate: deadlineDate,
        };
    }
    return {
        shouldShowModal: false,
        isOverdue: false,
        daysRemaining,
        reason: "not_yet",
        effectiveDueDate: deadlineDate,
    };
};
exports.checkKycStatus = checkKycStatus;
const shouldBlockWithdrawal = (kycState) => {
    let dueDateString = kycState.kycDueDate;
    if (!dueDateString || dueDateString === '') {
        dueDateString = process.env.REACT_APP_KYC_DEADLINE_DATE || '';
    }
    if (!dueDateString || dueDateString === '') {
        return false;
    }
    try {
        const now = new Date();
        const dueDate = (0, date_fns_1.parseISO)(dueDateString);
        if (isNaN(dueDate.getTime())) {
            console.warn('Invalid KYC due date:', dueDateString);
            return false;
        }
        return now > dueDate;
    }
    catch (error) {
        console.error('Error checking KYC due date:', error);
        return false;
    }
};
exports.shouldBlockWithdrawal = shouldBlockWithdrawal;
const dismissKycModal = () => {
    sessionStorage.setItem(exports.KYC_MODAL_DISMISS_KEY, "true");
};
exports.dismissKycModal = dismissKycModal;
const clearKycModalDismissal = () => {
    sessionStorage.removeItem(exports.KYC_MODAL_DISMISS_KEY);
};
exports.clearKycModalDismissal = clearKycModalDismissal;
//# sourceMappingURL=kycStatus.js.map