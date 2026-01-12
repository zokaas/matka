import { createSelector } from "reselect";
import { T_FormattedInvoice } from "@opr-finance/feature-statements";

import { AppState } from "../types/general";

export const selectNotPaidStatements = createSelector(
    (state: AppState) => state.invoices.formatted,
    (statements: Array<T_FormattedInvoice>) => {
        return statements?.filter(
            (statement) => statement.status === "OVERDUE" || statement.status === "PARTIALLYPAID"
        );
    }
);
