import * as VP from "@opr-finance/api-definitions";
import { T_WithdrawAmount } from "@opr-finance/feature-withdraw/src/smeLoan/components/StyledWithdraw";

export type T_WithdrawProps = {
    handleChange: (isValid: boolean, formName: string, form: T_WithdrawAmount) => void;
};
