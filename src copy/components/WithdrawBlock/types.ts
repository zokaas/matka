import * as VP from "@opr-finance/api-definitions";
import { T_WithdrawAmount } from "@opr-finance/feature-withdraw/src/smeLoan/components/StyledWithdraw";

export type T_WithdrawProps = {
    availableCreditLimit: number | undefined;
    overdueDays: number;
    unpaidAmount: number;
    accountState: VP.components["schemas"]["AccountState"] | undefined;
    blockedStatus: boolean | undefined;
    kycOverdue?: boolean;
    handleChange: (isValid: boolean, formName: string, form: T_WithdrawAmount) => void;
};
