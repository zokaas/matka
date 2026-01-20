import { T_TopupRules, T_WithdrawalRules } from "@opr-finance/utils";

export const withdrawalRules: T_WithdrawalRules = {
    minWithdrawal: 5000,
    overdueDays: 5,
    accountState: ["OPEN", "PENDING"],
    blockedStatus: false,
    kycOverdue: false,
};

export const topupRules: T_TopupRules = {
    creditLimit: 200000,
    accountState: ["OPEN"],
    overdueDays: 5,
    paidInvoices: 3,
    blockedStatus: false,
};
