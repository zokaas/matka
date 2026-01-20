import {
    T_SMEApplicationChannel,
    T_SMEApplicationState,
} from "@opr-finance/feature-sme-customer/src/types";
import { T_KycState } from "@opr-finance/feature-kyc";

export const initialFetchingTransactionsPeriod = 6; // Feth transactions for 6 last months

export const DEFAULT_KYC_STATE: T_KycState = {
    kycDone: false,
    kycUpdatedDate: "",
    kycDueDate: "",
};

export const allowedStatesByChannel: Partial<
    Record<T_SMEApplicationChannel, readonly T_SMEApplicationState[]>
> = {
    BROKER: ["PN_CREATED"],
    WEB: ["PENDING", "PN_CREATED"],
    PHONE: ["PENDING", "PN_CREATED"],
};

export const oprFinanceBrokerName = "OPRFinance";
