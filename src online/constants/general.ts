import { T_KycState } from "../types/kyc";

export const initialFetchingTransactionsPeriod = 6; // Feth transactions for 6 last months

export const DEFAULT_KYC_STATE: T_KycState = {
    kycDone: false,
    kycUpdatedDate: "",
};
