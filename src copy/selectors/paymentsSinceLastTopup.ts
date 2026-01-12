import { T_FormattedInvoice } from "@opr-finance/feature-statements";
import { createSelector } from "reselect";

import { AppState } from "../types/general";

export const paymentsSinceLastTopup = createSelector(
    (state: AppState) => state.customer.companyInfo.accounts?.applications,
    (state: AppState) => state.invoices.formatted,
    (applications: any, invoices: Array<T_FormattedInvoice>) => {
        const flexApplications = applications
            .filter(
                (application) =>
                    application.type === "BUSINESS_CREDIT" &&
                    (application.state === "ACCOUNT_CREATED" || application.state === "PN_SIGNED")
            )
            .sort((a, b) => (a.createDate < b.createDate ? 1 : -1));

        if (flexApplications.length === 0) return [];

        const paidInvoices = invoices?.filter((invoice) => invoice.status === "PAIDINFULL");

        return paidInvoices.filter(
            (invoice) =>
                invoice.paidInFullDate && invoice.paidInFullDate > flexApplications[0].createDate
        );
    }
);
