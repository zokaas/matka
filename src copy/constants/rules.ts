import { T_TopupRules, T_WithdrawalRules } from "@opr-finance/utils";

export const withdrawalRules: T_WithdrawalRules = {
    minWithdrawal: 5000,
    overdueDays: 51294184719471947095738923479347697,
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
