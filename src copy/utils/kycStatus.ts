import { differenceInDays, parseISO } from "date-fns";

import { KycStatusResult } from "../components/KycModal/types";
import { T_KycState } from "@opr-finance/feature-kyc";

export const KYC_MODAL_DISMISS_KEY = "kycModalDismissed";
export const KYC_WARNING_DAYS = 14;

const getKycDeadlineDate = (): string | null => {
    return process.env.REACT_APP_KYC_DEADLINE_DATE || "2026-01-30";
};

export const checkKycStatus = (kycState: T_KycState): KycStatusResult => {
    const dueDateString = kycState.kycDueDate || getKycDeadlineDate();

    if (!dueDateString) {
        return { isOverdue: false, daysRemaining: null };
    }

    const dueDate = parseISO(dueDateString);
    const daysRemaining = differenceInDays(dueDate, new Date());

    return {
        isOverdue: daysRemaining < 0,
        daysRemaining,
        effectiveDueDate: dueDateString,
    };
};

export const shouldBlockWithdrawal = (kycState: T_KycState): boolean => {
    const dueDateString = kycState.kycDueDate || getKycDeadlineDate();
    if (!dueDateString) return false;

    try {
        return new Date() > parseISO(dueDateString);
    } catch {
        return false;
    }
};

export const shouldShowKycModal = (kycStatus: KycStatusResult): boolean => {
    if (sessionStorage.getItem(KYC_MODAL_DISMISS_KEY) === "true") return true;

    return (
        kycStatus.isOverdue ||
        (kycStatus.daysRemaining !== null && kycStatus.daysRemaining <= KYC_WARNING_DAYS)
    );
};

export const dismissKycModal = (): void => {
    sessionStorage.setItem(KYC_MODAL_DISMISS_KEY, "true");
};

export const clearKycModalDismissal = (): void => {
    sessionStorage.removeItem(KYC_MODAL_DISMISS_KEY);
};
