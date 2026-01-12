import { createSelector } from "reselect";
import { selectNotPaidStatements } from "./selectNotPaidStatements";

export const selectUnpaidAmount = createSelector(selectNotPaidStatements, (items) =>
    items?.reduce((acc, item) => acc + (item?.unpaidAmount ?? 0), 0)
);
