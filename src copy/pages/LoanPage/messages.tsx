import {
    E_SmeTransactionStatuses,
    GeneratedMessages,
    generateMessageObject,
    MessageData,
} from "@opr-finance/feature-transactions-v2";
import { defineMessages } from "react-intl";

const transactionStatusesdata: MessageData[] = [
    {
        contentfulKey:
            "flex-online-se-transactions-table-title-loan-adjustment-interest-transaction",
        messageId: E_SmeTransactionStatuses.LOAN_ADJUSTMENT_INTEREST_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-disbursement",
        messageId: E_SmeTransactionStatuses.LOAN_TRANCHE_DISBURSEMENT_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-over-payment-after-last-statement",
        messageId: E_SmeTransactionStatuses.OVER_PAYMENT_AFTER_LAST_STATEMENT_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-payback-to-customer-from-account",
        messageId: E_SmeTransactionStatuses.PAYBACK_TO_CUSTOMER_FROM_ACCOUNT_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-payment",
        messageId: E_SmeTransactionStatuses.PAYMENT_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transaction-table-title-statement-amortization",
        messageId: E_SmeTransactionStatuses.STATEMENT_AMORTIZATION_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transaction-table-title-statement-fee",
        messageId: E_SmeTransactionStatuses.STATEMENT_FEE_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-statement-late-payment-interest",
        messageId: E_SmeTransactionStatuses.STATEMENT_LATE_PAYMENT_INTEREST_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-statement-interest",
        messageId: E_SmeTransactionStatuses.STATEMENT_INTEREST_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-statement-reminder-fee",
        messageId: E_SmeTransactionStatuses.STATEMENT_REMINDER_FEE_TRANSACTION,
    },
    // {
    //     contentfulKey: "flex-online-se-transactions-table-title-statement-rounding",
    //     messageId: E_SmeTransactionStatuses.STATEMENT_ROUNDING_TRANSACTION,
    // },
    {
        contentfulKey: "flex-online-se-transactions-table-title-statement-startup-fee-transaction",
        messageId: E_SmeTransactionStatuses.STATEMENT_STARTUP_FEE_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-statement-tranche-startup-fee",
        messageId: E_SmeTransactionStatuses.STATEMENT_TRANCHE_STARTUP_FEE_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-statement-direct-debit-fee",
        messageId: E_SmeTransactionStatuses.STATEMENT_DIRECT_DEBIT_FEE_TRANSACTION,
    },
    {
        contentfulKey: "flex-online-se-transactions-table-title-statement-summarised-interest",
        messageId: E_SmeTransactionStatuses.AGGREGATED_INTEREST_TRANSACTION,
    },
];

const generatedTransactionsMessages: GeneratedMessages =
    generateMessageObject(transactionStatusesdata);

export const messages = defineMessages({
    pageTitle: {
        id: "flex-online-se-loan-page-title",
    },
    heading1: {
        id: "flex-online-se-loan-page-heading-1",
    },
    textContentLeft1: {
        id: "flex-online-se-loan-page-text-content-left-1",
    },
    textContentLeft2: {
        id: "flex-online-se-loan-page-text-content-left-2",
    },
    textContentRight1: {
        id: "flex-online-se-loan-page-text-content-right-1",
    },
    textContentRight2: {
        id: "flex-online-se-loan-page-text-content-right-2",
    },
    textPhone: {
        id: "flex-online-se-text-phone",
    },
    textPhoneNumber: {
        id: "flex-online-se-phone-number",
    },
    textEmail: {
        id: "flex-online-se-text-email",
    },
    textEmailLink: {
        id: "flex-online-se-email-customerService-link",
    },
    textEmailText: {
        id: "flex-online-se-email-customerService-text",
    },
    loanDocumentsButtonText: {
        id: "flex-online-se-loan-page-button-text-loan-documents",
    },
    modalTitle: {
        id: "flex-online-se-loan-page-modal-title",
    },
    modalContent: {
        id: "flex-online-se-loan-page-modal-content",
    },
    modalButtonText: {
        id: "flex-online-se-loan-page-modal-button-text",
    },
    TableHeadingTransactions: {
        id: "flex-online-se-loan-page-table-heading-transactions",
    },
    TableHeadingInvoices: {
        id: "flex-online-se-loan-page-table-heading-invoices",
    },
    TableDate: {
        id: "flex-online-se-loan-page-table-date",
    },
    TableTransactionsType: {
        id: "flex-online-se-loan-page-table-transactions-type",
    },
    TableAmount: {
        id: "flex-online-se-loan-page-table-amount",
    },
    TableTextButton: {
        id: "flex-online-se-loan-page-table-text-button",
    },
    documentsError: {
        id: "flex-online-se-loan-page-documents-error",
    },
    withdrawButtonText: {
        id: "flex-online-se-withdraw-button-text",
    },
    invoiceNumber: {
        id: "flex-online-se-loan-page-invoice-number",
    },
    invoiceDefinition: {
        id: "flex-online-se-loan-page-invoice-definition",
    },
    invoiceStatus: {
        id: "flex-online-se-loan-page-invoice-status",
    },
    invoiceDueDate: {
        id: "flex-online-se-loan-page-invoice-due-date",
    },
    invoiceAmount: {
        id: "flex-online-se-loan-page-invoice-amount",
    },
    invoiceOverdue: {
        id: "flex-online-se-loan-page-invoice-overdue",
    },
    invoicePaid: {
        id: "flex-online-se-loan-page-invoice-paid",
    },
    invoiceUnpaid: {
        id: "flex-online-se-loan-page-invoice-unpaid",
    },
    invoicePartPaid: {
        id: "flex-online-se-loan-page-invoice-part-paid",
    },
    fromDate: {
        id: "flex-online-se-loan-page-table-from",
    },
    clearDates: {
        id: "flex-online-se-loan-page-table-clear",
    },
    downloadTransactions: {
        id: "flex-online-se-loan-page-download-transactions",
    },
    showAll: {
        id: "flex-online-se-loan-page-table-show-all",
    },
    pdfDownloadInstructions: {
        id: "flex-online-se-loan-page-pdf-download-instructions",
    },
    //reporting block messages
    reportingBlockHeading: {
        id: "flex-online-se-loan-page-reporting-heading",
    },
    reportingBlockNoAccountDataMessage: {
        id: "flex-online-se-loan-page-reporting-no-account-data-message",
    },
    reportingBlockInstructionsText: {
        id: "flex-online-se-loan-page-reporting-reports-overview-instructions-text",
    },
    reportingBlockNoReportsMessage: {
        id: "flex-online-se-loan-page-reporting-no-reports-message",
    },
    reportingBlockDateInputPlaceholder: {
        id: "flex-online-se-loan-page-reporting-date-input-placeholder",
    },
    reportingBlockButtonText: {
        id: "flex-online-se-loan-page-reporting-button-text",
    },
    reportingBlockLoadingText: {
        id: "flex-online-se-loan-page-reporting-loading-text",
    },
    reportingBlockErrorText: {
        id: "flex-online-se-loan-page-reporting-error-text",
    },
    ...generatedTransactionsMessages,
});
