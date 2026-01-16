import { differenceInDays, parseISO } from "date-fns";
import { T_KycState } from "../types/kyc";

export const KYC_MODAL_DISMISS_KEY = "kycModalDismissed";
export const KYC_WARNING_DAYS = 14;

// Get KYC deadline date from environment variable
export const getKycDeadlineDate = (): string | null => {
    const envDeadline = process.env.REACT_APP_KYC_DEADLINE_DATE;
    return envDeadline || null;
};

export type KycStatusResult = {
    shouldShowModal: boolean;
    isOverdue: boolean;
    daysRemaining: number | null;
    reason: "no_due_date" | "approaching_deadline" | "overdue" | "completed" | "dismissed" | "not_yet";
    effectiveDueDate?: string; // Fixed deadline date when kycDueDate is empty
};

/**
 * Check if KYC modal should be shown
 */
export const checkKycStatus = (kycState: T_KycState): KycStatusResult => {
    const { kycDone, kycDueDate } = kycState;

    // KYC already completed
    if (kycDone) {
        return {
            shouldShowModal: false,
            isOverdue: false,
            daysRemaining: null,
            reason: "completed",
        };
    }

    const today = new Date();

    // No due date set - use hard deadline from env variable
    if (!kycDueDate) {
        const deadlineDate = getKycDeadlineDate();
        
        if (!deadlineDate) {
            // No deadline configured - don't show modal
            return {
                shouldShowModal: false,
                isOverdue: false,
                daysRemaining: null,
                reason: "not_yet",
            };
        }

        const hardDeadline = parseISO(deadlineDate);
        const daysRemaining = differenceInDays(hardDeadline, today);

        // Check if user dismissed modal this session
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

        // Check if overdue
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

    // Calculate days until due date
    const dueDate = parseISO(kycDueDate);
    const daysRemaining = differenceInDays(dueDate, today);

    // Check if user dismissed modal this session
    const dismissed = sessionStorage.getItem(KYC_MODAL_DISMISS_KEY);
    if (dismissed === "true") {
        return {
            shouldShowModal: false,
            isOverdue: daysRemaining < 0,
            daysRemaining,
            reason: "dismissed",
        };
    }

    // Overdue
    if (daysRemaining < 0) {
        return {
            shouldShowModal: true,
            isOverdue: true,
            daysRemaining,
            reason: "overdue",
        };
    }

    // Approaching deadline (less than 14 days)
    if (daysRemaining <= KYC_WARNING_DAYS) {
        return {
            shouldShowModal: true,
            isOverdue: false,
            daysRemaining,
            reason: "approaching_deadline",
        };
    }

    // All good, more than 14 days remaining
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

    // KYC completed - allow withdrawal
    if (kycDone) {
        return false;
    }

    // No due date set - don't block yet
    if (!kycDueDate) {
        return false;
    }

    // Check if overdue
    const dueDate = parseISO(kycDueDate);
    const today = new Date();
    const daysRemaining = differenceInDays(dueDate, today);

    // Block if overdue
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