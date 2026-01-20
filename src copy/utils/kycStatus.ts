import { differenceInDays, parseISO } from "date-fns";
import { T_KycState } from "../types/kyc";
import { KycStatusResult } from "../components/KycModal/types";

export const KYC_MODAL_DISMISS_KEY = "kycModalDismissed";
export const KYC_WARNING_DAYS = 14;

export const getKycDeadlineDate = (): string | null => {
    const envDeadline = "2026-01-21";
    return envDeadline || null;
};

/**
 * Check KYC status and determine modal display
 * Shows modal 14 days before deadline
 */
export const checkKycStatus = (kycState: T_KycState): KycStatusResult => {
    const { kycDone, kycDueDate } = kycState;
    const today = new Date();

    // Priority 1: Check user's due date
    if (kycDueDate && kycDueDate !== '') {
        const dueDate = parseISO(kycDueDate);
        const daysRemaining = differenceInDays(dueDate, today);
        
        // Check if modal was dismissed
        const dismissed = sessionStorage.getItem(KYC_MODAL_DISMISS_KEY);
        if (dismissed === "true") {
            return {
                shouldShowModal: false,
                isOverdue: daysRemaining < 0,
                daysRemaining,
                reason: "dismissed",
            };
        }
        
        // Overdue - needs renewal NOW
        if (daysRemaining < 0) {
            return {
                shouldShowModal: true,
                isOverdue: true,
                daysRemaining,
                reason: kycDone ? "renewal_overdue" : "overdue",
            };
        }
        
        // Within warning period (≤14 days) - show warning
        if (daysRemaining <= KYC_WARNING_DAYS) {
            return {
                shouldShowModal: true,
                isOverdue: false,
                daysRemaining,
                reason: kycDone ? "renewal_approaching" : "approaching_deadline",
            };
        }
        
        // More than 14 days away - don't show modal yet
        return {
            shouldShowModal: false,
            isOverdue: false,
            daysRemaining,
            reason: "completed",
        };
    }

    // Priority 2: No user date, check ENV deadline
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

    // Check if modal was dismissed
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

    // Overdue
    if (daysRemaining < 0) {
        return {
            shouldShowModal: true,
            isOverdue: true,
            daysRemaining,
            reason: "no_due_date",
            effectiveDueDate: deadlineDate,
        };
    }

    // Within warning period (≤14 days) - show modal
    if (daysRemaining <= KYC_WARNING_DAYS) {
        return {
            shouldShowModal: true,
            isOverdue: false,
            daysRemaining,
            reason: "no_due_date",
            effectiveDueDate: deadlineDate,
        };
    }

    // More than 14 days away - don't show modal yet
    return {
        shouldShowModal: false,
        isOverdue: false,
        daysRemaining,
        reason: "not_yet",
        effectiveDueDate: deadlineDate,
    };
};

/**
 * Block withdrawals if KYC renewal is overdue
 * NOTE: Only blocks AFTER deadline passes, not during warning period
 */
export const shouldBlockWithdrawal = (kycState: T_KycState): boolean => {
    let dueDateString = kycState.kycDueDate;
    
    if (!dueDateString || dueDateString === '') {
        dueDateString = process.env.REACT_APP_KYC_DEADLINE_DATE || '';
    }

    if (!dueDateString || dueDateString === '') {
        return false;
    }

    try {
        const now = new Date();
        const dueDate = parseISO(dueDateString);
        
        if (isNaN(dueDate.getTime())) {
            console.warn('Invalid KYC due date:', dueDateString);
            return false;
        }
        
        // Block ONLY if overdue (after deadline)
        return now > dueDate;
        
    } catch (error) {
        console.error('Error checking KYC due date:', error);
        return false;
    }
};

export const dismissKycModal = (): void => {
    sessionStorage.setItem(KYC_MODAL_DISMISS_KEY, "true");
};

export const clearKycModalDismissal = (): void => {
    sessionStorage.removeItem(KYC_MODAL_DISMISS_KEY);
};