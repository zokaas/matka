import { createSelector } from "reselect";
import { AppState } from "../types/general";
import { T_ExistingCustomerApplication } from "@opr-finance/feature-sme-customer/src/types";

export const selectAccountApplicationId = createSelector(
    (state: AppState): T_ExistingCustomerApplication[] =>
        state.customer.companyInfo.accounts?.applications ?? [],
    (applications): string | undefined =>
        applications.find((app) => app.state === "ACCOUNT_CREATED")?.id
);
