import { createSelector } from "reselect";

import { AppState } from "../types/general";

export const selectPaidInvoices = createSelector(
    (state: AppState) => state.invoices.formatted,
    (invoices: any) => {
        return invoices?.filter((invoice) => invoice.status === "PAIDINFULL");
    }
);
