import { createSelector } from "reselect";

import { AppState } from "../types/general";

export const selectCompanyId = createSelector(
    (state: AppState) => state.customer.companyInfo.info?.organizationNumber ?? "",
    (companyId) => companyId
);
