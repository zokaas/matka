import { differenceInDays, parseISO } from "date-fns";
import { T_KycState } from "../types/kyc";
import { KycStatusResult } from "../components/KycModal/types";

export const KYC_MODAL_DISMISS_KEY = "kycModalDismissed";
export const KYC_WARNING_DAYS = 14;

//NOTE: date in env is just for existing customers, that are doin kycff, should be removed later?
export const getKycDeadlineDate = (): string | null => {
    const envDeadline = process.env.REACT_APP_KYC_DEADLINE_DATE;
    return envDeadline || null;
};

export const checkKycStatus = (kycState: T_KycState): KycStatusResult => {
    const { kycDone, kycDueDate } = kycState;

    if (kycDone) {
        return {
            shouldShowModal: false,
            isOverdue: false,
            daysRemaining: null,
            reason: "completed",
        };
    }

    const today = new Date();

    if (!kycDueDate) {
        const deadlineDate = getKycDeadlineDate();

        if (!deadlineDate) {
            return {
                shouldShowModal: false,
                isOverdue: false,
                daysRemaining: null,
                reason: "not_yet",
            };
        }

        const hardDeadline = parseISO(deadlineDate);
        const daysRemaining = differenceInDays(hardDeadline, today);

        const dismissed = sessionStorage.getItem(KYC_MODAL_DISMISS_KEY);
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

        return {
            shouldShowModal: true,
            isOverdue: false,
            daysRemaining,
            reason: "no_due_date",
            effectiveDueDate: deadlineDate,
        };
    }

    const dueDate = parseISO(kycDueDate);
    const daysRemaining = differenceInDays(dueDate, today);

    const dismissed = sessionStorage.getItem(KYC_MODAL_DISMISS_KEY);
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
            reason: "overdue",
        };
    }

    if (daysRemaining <= KYC_WARNING_DAYS) {
        return {
            shouldShowModal: true,
            isOverdue: false,
            daysRemaining,
            reason: "approaching_deadline",
        };
    }

    return {
        shouldShowModal: false,
        isOverdue: false,
        daysRemaining,
        reason: "not_yet",
    };
};

/**
 * Check if withdrawals should be blocked due to KYC
 */
export const shouldBlockWithdrawal = (kycState: T_KycState): boolean => {
    const { kycDone, kycDueDate } = kycState;

    if (kycDone) {
        return false;
    }

    if (!kycDueDate) {
        return false;
    }

    const dueDate = parseISO(kycDueDate);
    const today = new Date();
    const daysRemaining = differenceInDays(dueDate, today);

    return daysRemaining < 0;
};

/**
 * Dismiss KYC modal for this session
 */
export const dismissKycModal = (): void => {
    sessionStorage.setItem(KYC_MODAL_DISMISS_KEY, "true");
};

/**
 * Clear KYC modal dismissal (to show modal again)
 */
export const clearKycModalDismissal = (): void => {
    sessionStorage.removeItem(KYC_MODAL_DISMISS_KEY);
};