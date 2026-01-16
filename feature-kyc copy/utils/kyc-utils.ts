import { T_ExistingCustomerApplication } from "packages/feature-sme-customer/src/types";
import { ApplicationChannel, ApplicationState, KycData } from "../src/types";

/**
 * Check if application status is valid based on application channel
 */
export const isApplicationStatusValid = (
    applicationChannel: ApplicationChannel,
    applicationState: ApplicationState
): boolean => {
    if (applicationChannel === "BROKER") {
        return applicationState === "PN_CREATED";
    } else {
        return applicationState === "PENDING" || applicationState === "PN_CREATED";
    }
};

/**
 * Check if KYC has ever been filled
 */
export const hasKycBeenFilled = (kycUpdatedDate: string | undefined | null): boolean => {
    return !!kycUpdatedDate && kycUpdatedDate.trim() !== "";
};

/**
 * Calculate days since KYC was last updated
 */
export const getDaysSinceKycUpdate = (kycUpdatedDate: string): number => {
    if (!kycUpdatedDate) return Infinity;
    
    const kycDate = new Date(kycUpdatedDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - kycDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
};

/**
 * Check if KYC deadline has passed
 */
export const isKycDeadlinePassed = (
    kycUpdatedDate: string | undefined | null,
    deadlineDays: number
): boolean => {
    if (!kycUpdatedDate) {
        return false;
    }
    
    const daysSinceUpdate = getDaysSinceKycUpdate(kycUpdatedDate);
    return daysSinceUpdate > deadlineDays;
};

/**
 * Get KYC deadline date
 */
export const getKycDeadlineDate = (deadlineDays: number): Date => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineDays);
    return deadline;
};

/**
 * Format deadline date for display
 */
export const formatDeadlineDate = (date: Date): string => {
    return date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

/**
 * Extract KYC data from application
 */
export const getKycDataFromApplication = (
    application: T_ExistingCustomerApplication | undefined
): KycData => {
    if (!application?.dynamicFields?.kyc) {
        return {
            kycDone: false,
            kycUpdatedDate: undefined,
            hasKyc: false,
        };
    }

    const { kycDone, kycUpdatedDate, redirectUrl, riskScore, riskClassification, industryCode } = 
        application.dynamicFields.kyc;

    return {
        kycDone: kycDone || false,
        kycUpdatedDate,
        hasKyc: hasKycBeenFilled(kycUpdatedDate),
        redirectUrl,
        riskScore,
        riskClassification,
        industryCode,
    };
};

/**
 * Get environment variable for KYC deadline (in days)
 */
export const getKycDeadlineDays = (): number => {
    const deadline = process.env.REACT_APP_KYC_DEADLINE_DAYS || "30";
    return parseInt(deadline, 10);
};