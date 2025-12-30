import { useIntl } from "react-intl";
import { Font } from "@opr-finance/component-fonts";
import { StyledLink } from "@opr-finance/component-link-to";
import { StyledGrid } from "@opr-finance/component-grid";
import { T_ColumnsProps } from "./types";
import { messages } from "../../pages/LoanPage/messages";
import { T_FormattedInvoice } from "@opr-finance/feature-statements";

export const invoicesColumns = (props: T_ColumnsProps) => {
    const { formatMessage: fm } = useIntl();

    const date = new Date();

    return [
        {
            name: fm(messages.invoiceNumber),
            cell: (rowData) => (
                <StyledLink
                    styleConfig={{
                        root: props.styleConfig.invoicesTableLink,
                    }}
                    onClick={(event) => props.onClick(event, rowData.documentId)}
                    target="_blank">
                    {rowData.seriesNum}
                </StyledLink>
            ),
        },
        {
            name: fm(messages.invoiceDefinition),
            cell: (rowData) => (
                <StyledLink
                    styleConfig={{
                        root: props.styleConfig.invoicesTableLink,
                    }}
                    onClick={(event) => props.onClick(event, rowData.documentId)}
                    target="_blank">
                    {rowData.title}
                </StyledLink>
            ),
        },
        {
            name: fm(messages.invoiceStatus),
            selector: (rowData) => {
                switch (rowData.status) {
                    case "OVERDUE":
                        return fm(messages.invoiceOverdue);
                    case "PAIDINFULL":
                        return fm(messages.invoicePaid);
                    case "UNPAID":
                        return fm(messages.invoiceUnpaid);
                    case "PARTIALLYPAID":
                        return fm(messages.invoicePartPaid);
                    case "CREDIT": {
                        const amount = rowData.invoiceAmount - rowData.paidAmount;
                        if (amount >= 0.01 && rowData.dueDate > date) fm(messages.invoiceUnpaid);
                        if (amount >= 0.01 && rowData.dueDate < date)
                            return fm(messages.invoiceOverdue);
                        if (amount === 0.0) return fm(messages.invoicePaid);
                        return rowData.status;
                    }
                    default:
                        return rowData.status;
                }
            },
        },
        {
            name: fm(messages.invoiceDueDate),
            selector: (rowData: T_FormattedInvoice) => (rowData.dueDate ? rowData.dueDate : ""),
        },

        {
            name: fm(messages.invoiceAmount),
            selector: (rowData: T_FormattedInvoice) => rowData.amount,
        },
    ];
};

export const invoicesMobileColumns = (getPdfClick, styleConfig) => {
    const { formatMessage: fm } = useIntl();
    const date = new Date();

    const filterTypes = (rowData: any) => {
        switch (rowData.status) {
            case "OVERDUE":
                return fm(messages.invoiceOverdue);
            case "PAIDINFULL":
                return fm(messages.invoicePaid);
            case "UNPAID":
                return fm(messages.invoiceUnpaid);
            case "PARTIALLYPAID":
                return fm(messages.invoicePartPaid);
            case "CREDIT": {
                const amount = rowData.invoiceAmount - rowData.paidAmount;
                if (amount >= 0.01 && rowData.dueDate > date) return fm(messages.invoiceUnpaid);
                if (amount >= 0.01 && rowData.dueDate < date) return fm(messages.invoiceOverdue);
                if (amount === 0.0) return fm(messages.invoicePaid);
                return rowData.status;
            }
            default:
                return rowData.status;
        }
    };
    return [
        {
            name: "",
            cell: (rowData: any) => {
                const statementStatus = filterTypes(rowData);
                return (
                    <StyledGrid styleConfig={{ root: styleConfig.mobileTableContainer }}>
                        <StyledGrid styleConfig={{ root: styleConfig.invoiceInfoContainer }}>
                            <StyledLink
                                styleConfig={{
                                    root: { ...styleConfig.invoicesTableText, fontWeight: "bold" },
                                }}
                                onClick={(event) => getPdfClick(event, rowData.documentId)}
                                target="_blank">
                                {rowData.title}
                            </StyledLink>
                            <Font styleConfig={{ root: styleConfig.invoicesTableText }}>
                                {statementStatus}
                            </Font>
                            <Font styleConfig={{ root: styleConfig.invoicesTableText }}>
                                {rowData.dueDate}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: styleConfig.invoiceAmountContainer }}>
                            <Font styleConfig={{ root: styleConfig.invoicesTableText }}>
                                {rowData.amount}
                            </Font>
                        </StyledGrid>
                    </StyledGrid>
                );
            },
        },
    ];
};
