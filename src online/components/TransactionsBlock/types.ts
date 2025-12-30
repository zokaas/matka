import { I_SmeFormattedTransactions } from "@opr-finance/feature-transactions-v2";
import { T_AccountData } from "../../pages/LoanPage/types";

export type T_TransactionsProps = {
    statementTransactions: Array<I_SmeFormattedTransactions>;
    accountData: T_AccountData;
};
