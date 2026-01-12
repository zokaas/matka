import { createSelector } from "reselect";
import { selectNotPaidStatements } from "./selectNotPaidStatements";

export const selectOverdueDays = createSelector(selectNotPaidStatements, (items) =>
    items?.reduce((acc, item) => {
        return acc + (item?.overdueDays ?? 0);
    }, 0)
);
