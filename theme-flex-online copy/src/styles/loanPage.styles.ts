import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts } from "../general";
import { E_Colors } from "..";

export function loanPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}

export function loanPageInfoContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        marginX: ["16px", "0px"],
        lineHeight: E_Fonts.BASIC_LINE_HEIGHT,
    };
}

export function loanPageInfoBox(): SystemStyleObject {
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

export function loanPageInfoBoxContactContainer(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    };
}

export function loanPageLinkEmail(): SystemStyleObject {
    return {
        color: "#5c98d3",
        textDecoration: "none",
        fontWeight: "400",
    };
}

export function modalLayout(): SystemStyleObject {
    return {
        justifyContent: "center",
        textAlign: "center",
        margin: ["0", "20px 20px"],
    };
}

export function loanPageSections(): SystemStyleObject {
    return {
        width: "100%",
        marginTop: "20px",
    };
}

export function loanPageContainerInvoices(): SystemStyleObject {
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
export function loanPageTransactionContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        margin: "28px 0",
        justifyContent: "space-around",
    };
}

export function loanPageContainerTransactions(): SystemStyleObject {
    return {
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        marginBottom: "20px",
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        fontFamily: E_Fonts.FONT_FAMILY,
        boxSizing: "border-box",
        marginX: ["16px", "0px"],
    };
}

export function loanPageTransactionBlockContainer(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexDirection: ["column", "row"],
        padding: ["10px", "28px 35px"],
        justifyContent: "space-between",
    };
}
export function loanPageTransactionTableContainer(): SystemStyleObject {
    return {
        width: ["100%", "67%"],
        display: "flex",
        flexDirection: "column",
    };
}

export function loanPageTransactionTableDatesContainer(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexWrap: ["wrap", "nowrap"],
        padding: "10px 0",
    };
}

export function loanPageDatePicker(): SystemStyleObject {
    return {
        width: "150px",
        height: "30px",
        border: "1px solid #BEBEBE",
        padding: "0 8px",
        borderRadius: "2px",
        marginTop: ["5px", "auto"],
    };
}
export function loanPageShowAllTransactionsActionsContainer(): SystemStyleObject {
    return {
        width: "300px",
        display: "flex",
        justifyContent: ["center", "flex-end"],
        //marginLeft: "auto",
        alignItems: "center",
        marginTop: ["10px", 0],
    };
}

export function loanPageShowAllTransactionsCheckboxContainerTop(): SystemStyleObject {
    return {
        display: "flex",
        alignItems: "center",
    };
}
export function loanPageDateClearBtn(): SystemStyleObject {
    return {
        minWidth: "50px",
        height: "30px",
        boxShadow: "1 px 1px 5px #2a2a2a",
        border: "1px solid #BEBEBE",
        fontFamily: E_Fonts.FONT_FAMILY,
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

export function loanPageShowAllTransactionsCheckboxContainerBottom(): SystemStyleObject {
    return {
        minWidth: "100px",
        display: "flex",
        marginTop: ["auto", "10px"],
        order: [1, 3],
        marginBottom: ["15px", 0],
        justifyContent: "flex-end",
    };
}

export function loanPageTransactionSideInfoContainer(): SystemStyleObject {
    return {
        width: ["100%", "30%"],
        height: "auto",
        display: "flex",
        flexDirection: "column",
        padding: [0, "10px 0"],
    };
}

export function sideInfoContainerTextBox(): SystemStyleObject {
    return {
        width: "100%",
        height: "250px",
        border: "1px solid #D9D9D9",
        padding: "15px",
        margin: "15px 0",
        order: [3, 2],
    };
}
export function showAllTransactionsCheckbox(): SystemStyleObject {
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

export function loanPageTransactionTableWrapper(): SystemStyleObject {
    return {
        display: ["none", "flex"],
        width: "60%",
        height: "auto",
    };
}
export function loanPageTransactionTable(): SystemStyleObject {
    return {
        display: ["none", "flex"],
        width: "100%",
        height: "auto",
    };
}

export function loanPageTransactionTableMobile(): SystemStyleObject {
    return {
        display: ["flex", "none"],
        width: "600px",
        height: "auto",
    };
}

export function loanPageTransactionHeading(): SystemStyleObject {
    return {};
}

export function imageStyles(): SystemStyleObject {
    return {
        width: "80px",
        margin: "20px 0 20px 0",
    };
}

export function loanPageButtonContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
    };
}

export function loanPageInvoicesContainer(): SystemStyleObject {
    return {
        display: ["none", "flex"],
        margin: "28px 50px",
    };
}

export function loanPageInvoicesContainerMobile(): SystemStyleObject {
    return {
        display: ["flex", "none"],
        margin: "28px 10px",
    };
}

export function loadPageButtonWrap(): SystemStyleObject {
    return {
        margin: "0 0 20px 0",
        display: ["none", "flex"],
    };
}

export function loadPageButtonMobile(): SystemStyleObject {
    return {
        margin: "0 0 20px 0",
        display: ["none", "flex"],
    };
}

export function mobileTableContainer(): SystemStyleObject {
    return {
        display: "flex",
        width: "100%",
        marginRight: "8px",
        padding: "10px 0",
    };
}

export function invoiceInfoContainer(): SystemStyleObject {
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

export function invoiceAmountContainer(): SystemStyleObject {
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

export function invoicesTableText(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        fontFamily: E_Fonts.FONT_FAMILY,
    };
}

export function invoicesTableLink(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        fontFamily: E_Fonts.FONT_FAMILY,
        textDecoration: "underline",
        "&:hover": {
            color: "#66aadf",
        },
    };
}
export function popupContainer(): SystemStyleObject {
    return {
        backgroundColor: "#fff",
        border: "solid 0.5px #cee1f3",
        borderRadius: "4px",
        boxShadow: "0px 3px 7px 1px rgba(29, 29, 27, 0.25)",
        zIndex: 1,
    };
}

export function loanPageDateRange(): SystemStyleObject {
    return {
        display: "flex",
    };
}

export function creditRaiseContainer(): SystemStyleObject {
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
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        fontFamily: E_Fonts.FONT_FAMILY,
        boxSizing: "border-box",
    };
}

export function creditRaiseWrapper(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "center",
        alignItems: "center",
    };
}

export function creditRaiseInputColumn(): SystemStyleObject {
    return {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "300px",
        margin: "0 20px 20px",
    };
}

export function creditRaiseInputLabel(): SystemStyleObject {
    return {
        textAlign: ["center"],
        width: "300px",
        padding: "0",
        fontSize: "15px",
    };
}

export function creditRaiseInputSectionWrapper(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "center",
        alignItems: ["center", "flex-start"],
        width: ["100%", "fit-content"],
        paddingRight: [0, "10px"],
    };
}

export function creditIncreaseInputRow(): SystemStyleObject {
    return {
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "flex-start",
        fontSize: "16px",
        //marginLeft: ["-52px", 0],
    };
}

export function creditRaiseInput(): SystemStyleObject {
    return {
        border: "solid 1px #5c98d3",
        height: "32px",
        padding: "10px 68px 8px 11px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        backgroundColor: "#fff",
        color: E_Fonts.BASIC_FONT_COLOR,
        width: "270px",
        marginBottom: "10px",
    };
}
export function creditRaiseInputWrapper(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: ["center", "flex-start"],
    };
}
export function creditRaiseInputError(): SystemStyleObject {
    return {
        width: "100%",
        color: E_Colors.ERROR,
    };
}

export function creditRaiseEuroSign(): SystemStyleObject {
    return {
        fontSize: "24px",
        width: "32px",
        height: "32px",
        display: "inline-flex",
        justifyContent: "center",
        color: "#426ca6",
    };
}
export function errorMessage(): SystemStyleObject {
    return {
        color: "red",
        marginLeft: [0],
        textAlign: ["initial"],
    };
}

export function withdrawalSentMessageText(): SystemStyleObject {
    return {
        textAlign: "center",
    };
}

// reporting block styles

export function loanPageContainerReporting(): SystemStyleObject {
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

export function reportingRootContainer(): SystemStyleObject {
    return {
        width: "100%",
    };
}

export function reportsContainer(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        justifyContent: ["center", "flex-end"],
        alignItems: "center",
        flexWrap: "wrap",
    };
}

export function reportingBlockHeading(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_TITLE_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        fontWeight: 600,
        padding: 0,
        margin: "18px 0 22px 0",
        textAlign: "center",
    };
}

export function reportingInstructionsText(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        fontFamily: E_Fonts.FONT_FAMILY,
        marginBottom: "20px",
    };
}

export function reportingButton(): SystemStyleObject {
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
        background:
            "linear-gradient(0deg, rgba(79,169,60,1) 0%, rgba(133,184,117,1.30) 50%, rgba(79,169,60,1) 100%)",
        ":hover": {
            background:
                "linear-gradient(0deg, rgba(141,199,126,1) 0%, rgba(174,222,138,1) 50%, rgba(141,199,126,1) 100%)",
            cursor: "pointer",
        },
        ":active": {
            background:
                "linear-gradient(0deg, rgba(109,185,104,1) 0%, rgba(142,209,119,1.35) 50%, rgba(109,185,104,1) 100%)",
            cursor: "pointer",
        },
        ":disabled": {
            background: "#b0b0b0",
            cursor: "none",
        },
    };
}

export function reportingButtonText(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#f2f2f2",
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontWeight: 600,
        margin: 0,
    };
}

export function reportingErrorText(): SystemStyleObject {
    return {
        ...reportingButtonText,
        color: E_Colors.ERROR,
        textAlign: "start",
    };
}
export function reportingDatepicker(): SystemStyleObject {
    return {
        all: "unset",
        border: "1px solid #4d4d4d",
        height: "40px",
        borderRadius: "4px",
        margin: "5px 30px",
        padding: "0 10px",
    };
}
