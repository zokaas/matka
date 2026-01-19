import { SystemStyleObject } from "@styled-system/css";

import { E_Colors, E_Fonts } from "../general";

const frontPageTitleBaseStyles = {
    fontFamily: E_Fonts.FONT_FAMILY,
    color: E_Colors.PRIMARY,
    fontSize: E_Fonts.BASIC_FONT_TITLE_SIZE,
    width: "100%",
    fontWeight: "600",
    marginTop: "20px",
    lineHeight: "1.1",
};

export function frontPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
export function accountCollectionMainContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: 0,
        padding: ["10px", "10px 30px"],
    };
}
export function accountCollectionInfoBox(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: "0 0 15px 0",
        padding: ["20px", "30px"],
        backgroundColor: "#fff",
    };
}
export function accountCollectionInfoHeading(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_TITLE_SIZE,
        fontWeight: "bold",
        textAlign: "center",
        marginY: "10px",
    };
}
export function accountCollectionInfoText(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        margin: "10px 0 15px 0",
    };
}
export function accountCollectionEmailLink(): SystemStyleObject {
    return {
        color: E_Colors.LINK,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        textAlign: "center",
        margin: 0,
    };
}
export function collectionInfoItemContainer(): SystemStyleObject {
    return {
        marginTop: "10px",
    };
}

export function creditAgreementContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: 0,
        padding: ["20px", "30px"],
        backgroundColor: "#fff",
    };
}

export function downloadButtonContainer(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };
}
export function creditAgreementText(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        margin: "10px 0 15px 0",
        textAlign: "center",
        fontWeight: "bold",
    };
}

export function mainContentContainer(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
    };
}

export function nostoContainer(): SystemStyleObject {
    return {
        width: "auto",
        margin: "0 16px 16px 16px",
        backgroundColor: "white",
        display: ["flex", "none"],
        justifyContent: "center",
        alignItems: "center",
        paddingY: "20px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        cursor: "pointer",
    };
}
export function nostoImage(): SystemStyleObject {
    return {
        width: "87px",
        height: "61px",
    };
}
export function nostoText(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "24px",
        fontWeight: "600",
        marginLeft: "20px",
    };
}

export function loanInfoContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["100%", "100%", "716px"],
        background: "#fff",
        padding: "13px 13px 0 13px",
        order: [1, 1],
        marginRight: ["16px", 0, "16px"],
        marginLeft: ["16px", 0],
        marginBottom: [0, "16px", 0],
    };
}

export function loanInfoTitle(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_TITLE_SIZE,
        width: "100%",
        textAlign: "center",
        fontWeight: 600,
        marginTop: "20px",
        lineHeight: E_Fonts.BASIC_LINE_HEIGHT,
    };
}

export function remainingCreditWrapper(): SystemStyleObject {
    return {
        width: "100%",
        marginTop: "80px",
        textAlign: "center",
    };
}
export function remainingCreditText(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
    };
}

export function remainingCreditAmount(): SystemStyleObject {
    return {
        fontSize: E_Fonts.BASIC_FONT_TITLE_SIZE,
        margin: "10px 0 0 0",
    };
}

export function balanceContainer(): SystemStyleObject {
    return {
        width: "100%",
        padding: ["10px", "40px"],
    };
}

export function percentageContainer(): SystemStyleObject {
    return {
        display: "flex",
        width: "100%",
        height: "16px",
        margin: "50px auto 10px auto",
        padding: 0,
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "solid 2px #c1dae9",
        alignItems: "center",
        maxWidth: "500px",
    };
}

export function creditWrapper(): SystemStyleObject {
    return {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        fontSize: E_Fonts.SMALLER_FONT_SIZE,
    };
}

export function creditUsed(): SystemStyleObject {
    return {};
}

export function creditTotal(): SystemStyleObject {
    return {
        textAlign: "right",
    };
}

export function creditText(): SystemStyleObject {
    return {
        margin: "0 0 3px 0",
    };
}

export function balanceInfo(): SystemStyleObject {
    return {
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        margin: ["30px auto", "80px auto 0 auto"],
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        lineHeight: E_Fonts.BASIC_LINE_HEIGHT,
    };
}

export function newsContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["100%", "100%", "224px"],
        background: "#fff",
        padding: "13px",
        marginX: ["16px", 0],
        order: [3, 2],
        height: ["auto", "auto", "550px"], // equal to accountDetailBlock height on desktop view
        overflowY: "scroll",
        scrollBehavior: "smooth",
    };
}

export function creditRaiseContainer(): SystemStyleObject {
    return {
        width: "100%",
        background: "#fff",
        padding: "13px",
        marginTop: "16px",
        marginBottom: "16px",
        order: [2, 3],
        marginX: ["16px", 0],
    };
}

export function creditRaiseTitle(): SystemStyleObject {
    return {
        ...frontPageTitleBaseStyles,
        textAlign: "center",
        display: "block",
    };
}

export function creditRaiseWrapper(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
    };
}

export function creditRaiseInputColumn(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: ["100%", "405px"],
        paddingRight: [0, "10px"],
    };
}
export function creditRaiseInputSectionWrapper(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: ["100%", "fit-content"],
        paddingRight: [0, "10px"],
    };
}

export function creditIncreaseInputRow(): SystemStyleObject {
    return {
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
        marginBottom: "10px",
    };
}

export function creditRaiseInput(): SystemStyleObject {
    return {
        width: "280px",
        border: "solid 1px #5c98d3",
        height: "32px",
        padding: "10px 68px 8px 11px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        backgroundColor: "#fff",
        color: E_Fonts.BASIC_FONT_COLOR,
    };
}
export function creditRaiseInputWrapper(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    };
}
export function creditRaiseInputError(): SystemStyleObject {
    return {
        width: "100%",
        color: E_Colors.ERROR,
    };
}

export function creditRaiseEuroSign(props?: {
    marginRight?: string | number;
    marginLeft?: string | number;
    order?: number;
}): SystemStyleObject {
    return {
        fontSize: "24px",
        width: "17px",
        height: "32px",
        display: "inline-flex",
        justifyContent: "center",
        color: "#426ca6",
        marginRight: props && props.marginRight ? props.marginRight : "10px",
        marginLeft: props && props.marginLeft ? props.marginLeft : 0,
        order: props && props.order ? props.order : 0,
    };
}

export function creditRaiseInfoColumn(): SystemStyleObject {
    return {
        marginTop: ["40px"],
    };
}
export function creditRaiseText({ textAlign }): SystemStyleObject {
    return {
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        marginLeft: "10px",
        textAlign,
    };
}

export function rulesContainer(): SystemStyleObject {
    return {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    };
}

export function errorMessage(): SystemStyleObject {
    return {
        color: "red",
        width: "300px",
    };
}

export function notEligibleReasonContainer(): SystemStyleObject {
    return {
        color: "red",
        width: "300px",
        textAlign: "left",
    };
}

function baseWithdrawButton(props?: any) {
    return {
        width: "150px",
        borderRadius: "5px",
        padding: "7px 0",
        border: "none",
        display: "block",
    };
}

export function withdrawButton(props?: any): SystemStyleObject {
    return {
        ...baseWithdrawButton(),
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

export function withdrawDisabledButton(props?: any): SystemStyleObject {
    return {
        ...baseWithdrawButton(),
        background:
            "linear-gradient(0deg,rgba(148,151,147) 0%,rgb(195 197 194) 50%,rgba(148,151,147,1) 100%)",
        ":hover": {
            background:
                "linear-gradient(0deg,rgba(140,141,139) 0%,rgb(175 180 174) 50%,rgba(140,141,139,1) 100%)",
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

export function buttonInfo(): SystemStyleObject {
    return {
        width: "300px",
    };
}
