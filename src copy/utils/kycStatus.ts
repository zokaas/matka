import { differenceInDays, parseISO } from "date-fns";
import { T_KycStatusResult } from "../components/KycModal/types";
import { T_KycReducerState } from "@opr-finance/feature-kyc";

export const KYC_MODAL_DISMISS_KEY = "kycModalDismissed";
export const KYC_WARNING_DAYS = 21;

export const checkKycStatus = (kyc: T_KycReducerState): T_KycStatusResult => {
    const dueDateString = kyc.kycStatus.kycDueDate || process.env.REACT_APP_KYC_DEADLINE_DATE;
    const returnedFromKyc = kyc.returnedFromKyc;

    if (!dueDateString || returnedFromKyc) {
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

export const shouldBlockWithdrawal = (kyc: T_KycReducerState): boolean => {
    if (kyc.returnedFromKyc) return false;

    const dueDateString = kyc.kycStatus.kycDueDate || process.env.REACT_APP_KYC_DEADLINE_DATE;
    if (!dueDateString) return false;

    try {
        return new Date() > parseISO(dueDateString);
    } catch {
        return false;
    }
};

export const shouldShowKycComponent = (kycStatus: T_KycStatusResult): boolean => {
    return (
        kycStatus.isOverdue ||
        (kycStatus.daysRemaining !== null && kycStatus.daysRemaining <= KYC_WARNING_DAYS)
    );
};

export const shouldShowKycNotice = (kycStatus: T_KycStatusResult): boolean => {
    return shouldShowKycComponent(kycStatus);
};

export const shouldShowKycModal = (kycStatus: T_KycStatusResult): boolean => {
    if (sessionStorage.getItem(KYC_MODAL_DISMISS_KEY) === "true") return false;
    return shouldShowKycComponent(kycStatus);
};

export const dismissKycModal = (): void => {
    sessionStorage.setItem(KYC_MODAL_DISMISS_KEY, "true");
};

export const clearKycModalDismissal = (): void => {
    sessionStorage.removeItem(KYC_MODAL_DISMISS_KEY);
};
