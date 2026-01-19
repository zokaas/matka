"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanPageRootStyles = loanPageRootStyles;
exports.loanPageInfoContainer = loanPageInfoContainer;
exports.loanPageInfoBox = loanPageInfoBox;
exports.loanPageLinkEmail = loanPageLinkEmail;
exports.modalLayout = modalLayout;
exports.loanPageSections = loanPageSections;
exports.loanPageContainerInvoices = loanPageContainerInvoices;
exports.loanPageContainerTransactions = loanPageContainerTransactions;
exports.loanPageTransactionContainer = loanPageTransactionContainer;
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
exports.invoicesTableTextAmount = invoicesTableTextAmount;
exports.invoicesTableLink = invoicesTableLink;
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
function loanPageLinkEmail() {
    return {
        color: "#5c98d3",
        textDecoration: "none",
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
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        marginBottom: "20px",
    };
}
function loanPageContainerTransactions() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        marginBottom: "20px",
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
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
function loanPageTransactionTable() {
    return {
        display: ["none", "flex"],
        width: "600px",
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
        fontSize: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
    };
}
function invoicesTableTextAmount() {
    return {
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        wordBreak: "normal",
    };
}
function invoicesTableLink() {
    return {
        color: __1.E_Colors.PRIMARY,
        fontSize: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        textDecoration: "underline",
        "&:hover": {
            color: "#66aadf",
        },
    };
}
//# sourceMappingURL=loanPage.styles-OLD.js.map