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

export function loanPageLinkEmail(): SystemStyleObject {
    return {
        color: "#5c98d3",
        textDecoration: "none",
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
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        marginBottom: "20px",
    };
}

export function loanPageContainerTransactions(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        marginBottom: "20px",
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_COLOR,
        fontFamily: E_Fonts.FONT_FAMILY,
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

export function loanPageTransactionTable(): SystemStyleObject {
    return {
        display: ["none", "flex"],
        width: "600px",
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
        fontSize: E_Fonts.BASIC_FONT_COLOR,
        fontFamily: E_Fonts.FONT_FAMILY,
    };
}
export function invoicesTableTextAmount(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_COLOR,
        fontFamily: E_Fonts.FONT_FAMILY,
        wordBreak: "normal",
    };
}

export function invoicesTableLink(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontSize: E_Fonts.BASIC_FONT_COLOR,
        fontFamily: E_Fonts.FONT_FAMILY,
        textDecoration: "underline",
        "&:hover": {
            color: "#66aadf",
        },
    };
}
