import React from "react";
import { useIntl } from "react-intl";

import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { FontsStyles, LoanPageStyles } from "@opr-finance/theme-flex-online";

import { Invoices } from "../Invoices/Invoices";
import { T_InvoicesTableProps } from "../Invoices/types";
import { messages } from "../../pages/LoanPage/messages";

export function InvoicesBlock(props: T_InvoicesTableProps) {
    const { formatMessage: fm } = useIntl();

    return (
        <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageContainerInvoices() }}>
            <Font styleConfig={{ root: FontsStyles.fontBoxTitle() }} as="p">
                {fm(messages.TableHeadingInvoices)}
            </Font>
            <Invoices data={props.data} onClick={props.onClick} />
        </StyledGrid>
    );
}
