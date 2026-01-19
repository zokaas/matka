import { T_KycState } from "../types/kyc";
import { KycStatusResult } from "../components/KycModal/types";
export declare const KYC_MODAL_DISMISS_KEY = "kycModalDismissed";
export declare const KYC_WARNING_DAYS = 14;
export declare const getKycDeadlineDate: () => string | null;
export declare const checkKycStatus: (kycState: T_KycState) => KycStatusResult;
export declare const shouldBlockWithdrawal: (kycState: T_KycState) => boolean;
export declare const dismissKycModal: () => void;
export declare const clearKycModalDismissal: () => void;
