import React from "react";

import { LoanPageStyles } from "@opr-finance/theme-flex-online";
import { StyledGrid } from "@opr-finance/component-grid";
import { GenericTable } from "../GenericTable/GenericTable";
import { invoicesColumns, invoicesMobileColumns } from "./invoicesColumns";
import { T_InvoicesTableProps } from "./types";

export function Invoices(props: T_InvoicesTableProps) {
    return (
        <>
            <StyledGrid
                styleConfig={{
                    root: LoanPageStyles.loanPageInvoicesContainer(),
                }}>
                <GenericTable
                    data={props.data}
                    columns={invoicesColumns({
                        onClick: props.onClick,
                        styleConfig: {
                            invoicesTableLink: LoanPageStyles.invoicesTableLink(),
                        },
                    })}
                />
            </StyledGrid>
            <StyledGrid
                styleConfig={{
                    root: LoanPageStyles.loanPageInvoicesContainerMobile(),
                }}>
                <GenericTable
                    noTableHead={true}
                    data={props.data}
                    columns={invoicesMobileColumns(props.onClick, {
                        mobileTableContainer: LoanPageStyles.mobileTableContainer(),
                        invoiceInfoContainer: LoanPageStyles.invoiceInfoContainer(),
                        invoiceAmountContainer: LoanPageStyles.invoiceAmountContainer(),
                        invoicesTableText: LoanPageStyles.invoicesTableText(),
                    })}
                />
            </StyledGrid>
        </>
    );
}
