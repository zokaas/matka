import React from "react";

import { StyledGrid } from "@opr-finance/component-grid";
import { LoanPageStyles } from "@opr-finance/theme-flex-online";

import { GenericTable } from "../GenericTable/GenericTable";
import { T_TransactionsTableProps } from "./types";

export function Transactions(props: T_TransactionsTableProps) {
    return (
        <>
            <StyledGrid
                styleConfig={{
                    root: LoanPageStyles.loanPageTransactionTable(),
                }}>
                <GenericTable showAll={props.showAll} data={props.data} columns={props.columns} />
            </StyledGrid>
            <StyledGrid
                styleConfig={{
                    root: LoanPageStyles.loanPageInvoicesContainerMobile(),
                }}>
                <GenericTable
                    showAll={props.showAll}
                    columns={props.mobileColumns}
                    data={props.data}
                    noTableHead={true}
                />
            </StyledGrid>
        </>
    );
}
