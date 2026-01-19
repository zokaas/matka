"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanPageRootStyles = loanPageRootStyles;
exports.loanPageInfoContainer = loanPageInfoContainer;
exports.loanPageInfoBox = loanPageInfoBox;
exports.loanPageInfoBoxContactContainer = loanPageInfoBoxContactContainer;
exports.loanPageLinkEmail = loanPageLinkEmail;
exports.modalLayout = modalLayout;
exports.loanPageSections = loanPageSections;
exports.loanPageContainerInvoices = loanPageContainerInvoices;
exports.loanPageTransactionContainer = loanPageTransactionContainer;
exports.loanPageContainerTransactions = loanPageContainerTransactions;
exports.loanPageTransactionBlockContainer = loanPageTransactionBlockContainer;
exports.loanPageTransactionTableContainer = loanPageTransactionTableContainer;
exports.loanPageTransactionTableDatesContainer = loanPageTransactionTableDatesContainer;
exports.loanPageDatePicker = loanPageDatePicker;
exports.loanPageShowAllTransactionsActionsContainer = loanPageShowAllTransactionsActionsContainer;
exports.loanPageShowAllTransactionsCheckboxContainerTop = loanPageShowAllTransactionsCheckboxContainerTop;
exports.loanPageDateClearBtn = loanPageDateClearBtn;
exports.loanPageShowAllTransactionsCheckboxContainerBottom = loanPageShowAllTransactionsCheckboxContainerBottom;
exports.loanPageTransactionSideInfoContainer = loanPageTransactionSideInfoContainer;
exports.sideInfoContainerTextBox = sideInfoContainerTextBox;
exports.showAllTransactionsCheckbox = showAllTransactionsCheckbox;
exports.loanPageTransactionTableWrapper = loanPageTransactionTableWrapper;
exports.loanPageTransactionTable = loanPageTransactionTable;
exports.loanPageTransactionTableMobile = loanPageTransactionTableMobile;
exports.loanPageTransactionHeading = loanPageTransactionHeading;
exports.imageStyles = imageStyles;
exports.loanPageButtonContainer = loanPageButtonContainer;
exports.loanPageInvoicesContainer = loanPageInvoicesContainer;
exports.loanPageInvoicesContainerMobile = loanPageInvoicesContainerMobile;
exports.loadPageButtonWrap = loadPageButtonWrap;
exports.loadPageButtonMobile = loadPageButtonMobile;
exports.mobileTableContainer = mobileTableContainer;
exports.invoiceInfoContainer = invoiceInfoContainer;
exports.invoiceAmountContainer = invoiceAmountContainer;
exports.invoicesTableText = invoicesTableText;
exports.invoicesTableLink = invoicesTableLink;
exports.popupContainer = popupContainer;
exports.loanPageDateRange = loanPageDateRange;
exports.creditRaiseContainer = creditRaiseContainer;
exports.creditRaiseWrapper = creditRaiseWrapper;
exports.creditRaiseInputColumn = creditRaiseInputColumn;
exports.creditRaiseInputLabel = creditRaiseInputLabel;
exports.creditRaiseInputSectionWrapper = creditRaiseInputSectionWrapper;
exports.creditIncreaseInputRow = creditIncreaseInputRow;
exports.creditRaiseInput = creditRaiseInput;
exports.creditRaiseInputWrapper = creditRaiseInputWrapper;
exports.creditRaiseInputError = creditRaiseInputError;
exports.creditRaiseEuroSign = creditRaiseEuroSign;
exports.errorMessage = errorMessage;
exports.withdrawalSentMessageText = withdrawalSentMessageText;
exports.loanPageContainerReporting = loanPageContainerReporting;
exports.reportingRootContainer = reportingRootContainer;
exports.reportsContainer = reportsContainer;
exports.reportingBlockHeading = reportingBlockHeading;
exports.reportingInstructionsText = reportingInstructionsText;
exports.reportingButton = reportingButton;
exports.reportingButtonText = reportingButtonText;
exports.reportingErrorText = reportingErrorText;
exports.reportingDatepicker = reportingDatepicker;
const general_1 = require("../general");
const __1 = require("..");
function loanPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function loanPageInfoContainer() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        marginX: ["16px", "0px"],
        lineHeight: general_1.E_Fonts.BASIC_LINE_HEIGHT,
    };
}
function loanPageInfoBox() {
    return {
        width: ["100%", "472px"],
        height: "100%",
        padding: ["0 9px 76px 9px", "0 24px 76px 24px"],
        backgroundColor: "#fff",
        textAlign: "center",
        "&:first-child": {
            marginRight: ["0", "16px"],
            marginBottom: ["16px", "0"],
        },
    };
}
function loanPageInfoBoxContactContainer() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    };
}
function loanPageLinkEmail() {
    return {
        color: "#5c98d3",
        textDecoration: "none",
        fontWeight: "400",
    };
}
function modalLayout() {
    return {
        justifyContent: "center",
        textAlign: "center",
        margin: ["0", "20px 20px"],
    };
}
function loanPageSections() {
    return {
        width: "100%",
        marginTop: "20px",
    };
}
function loanPageContainerInvoices() {
    return {
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        marginBottom: "20px",
        boxSizing: "border-box",
        marginX: ["16px", "0px"],
    };
}
function loanPageTransactionContainer() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        margin: "28px 0",
        justifyContent: "space-around",
    };
}
function loanPageContainerTransactions() {
    return {
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        marginBottom: "20px",
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        boxSizing: "border-box",
        marginX: ["16px", "0px"],
    };
}
function loanPageTransactionBlockContainer() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: ["column", "row"],
        padding: ["10px", "28px 35px"],
        justifyContent: "space-between",
    };
}
function loanPageTransactionTableContainer() {
    return {
        width: ["100%", "67%"],
        display: "flex",
        flexDirection: "column",
    };
}
function loanPageTransactionTableDatesContainer() {
    return {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: ["wrap", "nowrap"],
        padding: "10px 0",
    };
}
function loanPageDatePicker() {
    return {
        width: "150px",
        height: "30px",
        border: "1px solid #BEBEBE",
        padding: "0 8px",
        borderRadius: "2px",
        marginTop: ["5px", "auto"],
    };
}
function loanPageShowAllTransactionsActionsContainer() {
    return {
        width: "300px",
        display: "flex",
        justifyContent: ["center", "flex-end"],
        alignItems: "center",
        marginTop: ["10px", 0],
    };
}
function loanPageShowAllTransactionsCheckboxContainerTop() {
    return {
        display: "flex",
        alignItems: "center",
    };
}
function loanPageDateClearBtn() {
    return {
        minWidth: "50px",
        height: "30px",
        boxShadow: "1 px 1px 5px #2a2a2a",
        border: "1px solid #BEBEBE",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontWeight: "600",
        fontSize: "12px",
        margin: "0 20px",
        padding: "0 10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "4px",
        ":hover": {
            backgroundColor: "#BEBEBE",
        },
        cursor: "pointer",
    };
}
function loanPageShowAllTransactionsCheckboxContainerBottom() {
    return {
        minWidth: "100px",
        display: "flex",
        marginTop: ["auto", "10px"],
        order: [1, 3],
        marginBottom: ["15px", 0],
        justifyContent: "flex-end",
    };
}
function loanPageTransactionSideInfoContainer() {
    return {
        width: ["100%", "30%"],
        height: "auto",
        display: "flex",
        flexDirection: "column",
        padding: [0, "10px 0"],
    };
}
function sideInfoContainerTextBox() {
    return {
        width: "100%",
        height: "250px",
        border: "1px solid #D9D9D9",
        padding: "15px",
        margin: "15px 0",
        order: [3, 2],
    };
}
function showAllTransactionsCheckbox() {
    return {
        width: "24px",
        height: "24px",
        borderRadius: "4px",
        border: "solid 1px #D9D9D9",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    };
}
function loanPageTransactionTableWrapper() {
    return {
        display: ["none", "flex"],
        width: "60%",
        height: "auto",
    };
}
function loanPageTransactionTable() {
    return {
        display: ["none", "flex"],
        width: "100%",
        height: "auto",
    };
}
function loanPageTransactionTableMobile() {
    return {
        display: ["flex", "none"],
        width: "600px",
        height: "auto",
    };
}
function loanPageTransactionHeading() {
    return {};
}
function imageStyles() {
    return {
        width: "80px",
        margin: "20px 0 20px 0",
    };
}
function loanPageButtonContainer() {
    return {
        display: "flex",
        flexDirection: "column",
    };
}
function loanPageInvoicesContainer() {
    return {
        display: ["none", "flex"],
        margin: "28px 50px",
    };
}
function loanPageInvoicesContainerMobile() {
    return {
        display: ["flex", "none"],
        margin: "28px 10px",
    };
}
function loadPageButtonWrap() {
    return {
        margin: "0 0 20px 0",
        display: ["none", "flex"],
    };
}
function loadPageButtonMobile() {
    return {
        margin: "0 0 20px 0",
        display: ["none", "flex"],
    };
}
function mobileTableContainer() {
    return {
        display: "flex",
        width: "100%",
        marginRight: "8px",
        padding: "10px 0",
    };
}
function invoiceInfoContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "left",
        justifySelf: "left",
        marginLeft: 0,
        marginRight: "auto",
        width: "auto",
    };
}
function invoiceAmountContainer() {
    return {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "right",
        justifySelf: "right",
        marginLeft: "auto",
        marginRight: 0,
        width: "auto",
        alignItems: "center",
    };
}
function invoicesTableText() {
    return {
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
    };
}
function invoicesTableLink() {
    return {
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        textDecoration: "underline",
        "&:hover": {
            color: "#66aadf",
        },
    };
}
function popupContainer() {
    return {
        backgroundColor: "#fff",
        border: "solid 0.5px #cee1f3",
        borderRadius: "4px",
        boxShadow: "0px 3px 7px 1px rgba(29, 29, 27, 0.25)",
        zIndex: 1,
    };
}
function loanPageDateRange() {
    return {
        display: "flex",
    };
}
function creditRaiseContainer() {
    return {
        maxWidth: "100%",
        padding: "13px",
        backgroundColor: "#fff",
        order: [2, 3],
        marginX: ["16px", 0],
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: "20px",
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        boxSizing: "border-box",
    };
}
function creditRaiseWrapper() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "center",
        alignItems: "center",
    };
}
function creditRaiseInputColumn() {
    return {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "300px",
        margin: "0 20px 20px",
    };
}
function creditRaiseInputLabel() {
    return {
        textAlign: ["center"],
        width: "300px",
        padding: "0",
        fontSize: "15px",
    };
}
function creditRaiseInputSectionWrapper() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "center",
        alignItems: ["center", "flex-start"],
        width: ["100%", "fit-content"],
        paddingRight: [0, "10px"],
    };
}
function creditIncreaseInputRow() {
    return {
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "flex-start",
        fontSize: "16px",
    };
}
function creditRaiseInput() {
    return {
        border: "solid 1px #5c98d3",
        height: "32px",
        padding: "10px 68px 8px 11px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        backgroundColor: "#fff",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        width: "270px",
        marginBottom: "10px",
    };
}
function creditRaiseInputWrapper() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: ["center", "flex-start"],
    };
}
function creditRaiseInputError() {
    return {
        width: "100%",
        color: __1.E_Colors.ERROR,
    };
}
function creditRaiseEuroSign() {
    return {
        fontSize: "24px",
        width: "32px",
        height: "32px",
        display: "inline-flex",
        justifyContent: "center",
        color: "#426ca6",
    };
}
function errorMessage() {
    return {
        color: "red",
        marginLeft: [0],
        textAlign: ["initial"],
    };
}
function withdrawalSentMessageText() {
    return {
        textAlign: "center",
    };
}
function loanPageContainerReporting() {
    return {
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        marginBottom: "20px",
        boxSizing: "border-box",
        marginX: ["16px", "0px"],
        padding: "0 28px",
    };
}
function reportingRootContainer() {
    return {
        width: "100%",
    };
}
function reportsContainer() {
    return {
        width: "100%",
        display: "flex",
        justifyContent: ["center", "flex-end"],
        alignItems: "center",
        flexWrap: "wrap",
    };
}
function reportingBlockHeading() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_TITLE_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontWeight: 600,
        padding: 0,
        margin: "18px 0 22px 0",
        textAlign: "center",
    };
}
function reportingInstructionsText() {
    return {
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        marginBottom: "20px",
    };
}
function reportingButton() {
    return {
        all: "unset",
        width: "auto",
        borderRadius: "5px",
        border: "none",
        margin: "5px 10px",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(0deg, rgba(79,169,60,1) 0%, rgba(133,184,117,1.30) 50%, rgba(79,169,60,1) 100%)",
        ":hover": {
            background: "linear-gradient(0deg, rgba(141,199,126,1) 0%, rgba(174,222,138,1) 50%, rgba(141,199,126,1) 100%)",
            cursor: "pointer",
        },
        ":active": {
            background: "linear-gradient(0deg, rgba(109,185,104,1) 0%, rgba(142,209,119,1.35) 50%, rgba(109,185,104,1) 100%)",
            cursor: "pointer",
        },
        ":disabled": {
            background: "#b0b0b0",
            cursor: "none",
        },
    };
}
function reportingButtonText() {
    return {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#f2f2f2",
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontWeight: 600,
        margin: 0,
    };
}
function reportingErrorText() {
    return Object.assign(Object.assign({}, reportingButtonText), { color: __1.E_Colors.ERROR, textAlign: "start" });
}
function reportingDatepicker() {
    return {
        all: "unset",
        border: "1px solid #4d4d4d",
        height: "40px",
        borderRadius: "4px",
        margin: "5px 30px",
        padding: "0 10px",
    };
}
//# sourceMappingURL=loanPage.styles.js.map