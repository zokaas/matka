import { I_SmeFormattedTransactions } from "@opr-finance/feature-transactions-v2";

type T_TransactionsColumns =
    | {
          name: string | undefined;
          selector: (rowData: I_SmeFormattedTransactions) => string;
      }
    | {
          name: string | undefined;
          cell?: (rowData: I_SmeFormattedTransactions) => string | undefined;
      };

type T_TransactionsMobileColumns = {
    name: string;
    cell: (rowData: any) => JSX.Element;
};

export type T_TransactionsTableProps = {
    showAll?: boolean;
    data: Array<I_SmeFormattedTransactions>;
    columns: Array<T_TransactionsColumns>;
    mobileColumns: Array<T_TransactionsMobileColumns>;
};
