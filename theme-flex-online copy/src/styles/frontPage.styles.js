"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.frontPageRootStyles = frontPageRootStyles;
exports.accountCollectionMainContainer = accountCollectionMainContainer;
exports.accountCollectionInfoBox = accountCollectionInfoBox;
exports.accountCollectionInfoHeading = accountCollectionInfoHeading;
exports.accountCollectionInfoText = accountCollectionInfoText;
exports.accountCollectionEmailLink = accountCollectionEmailLink;
exports.collectionInfoItemContainer = collectionInfoItemContainer;
exports.creditAgreementContainer = creditAgreementContainer;
exports.downloadButtonContainer = downloadButtonContainer;
exports.creditAgreementText = creditAgreementText;
exports.mainContentContainer = mainContentContainer;
exports.nostoContainer = nostoContainer;
exports.nostoImage = nostoImage;
exports.nostoText = nostoText;
exports.loanInfoContainer = loanInfoContainer;
exports.loanInfoTitle = loanInfoTitle;
exports.remainingCreditWrapper = remainingCreditWrapper;
exports.remainingCreditText = remainingCreditText;
exports.remainingCreditAmount = remainingCreditAmount;
exports.balanceContainer = balanceContainer;
exports.percentageContainer = percentageContainer;
exports.creditWrapper = creditWrapper;
exports.creditUsed = creditUsed;
exports.creditTotal = creditTotal;
exports.creditText = creditText;
exports.balanceInfo = balanceInfo;
exports.newsContainer = newsContainer;
exports.creditRaiseContainer = creditRaiseContainer;
exports.creditRaiseTitle = creditRaiseTitle;
exports.creditRaiseWrapper = creditRaiseWrapper;
exports.creditRaiseInputColumn = creditRaiseInputColumn;
exports.creditRaiseInputSectionWrapper = creditRaiseInputSectionWrapper;
exports.creditIncreaseInputRow = creditIncreaseInputRow;
exports.creditRaiseInput = creditRaiseInput;
exports.creditRaiseInputWrapper = creditRaiseInputWrapper;
exports.creditRaiseInputError = creditRaiseInputError;
exports.creditRaiseEuroSign = creditRaiseEuroSign;
exports.creditRaiseInfoColumn = creditRaiseInfoColumn;
exports.creditRaiseText = creditRaiseText;
exports.rulesContainer = rulesContainer;
exports.errorMessage = errorMessage;
exports.notEligibleReasonContainer = notEligibleReasonContainer;
exports.withdrawButton = withdrawButton;
exports.withdrawDisabledButton = withdrawDisabledButton;
exports.buttonInfo = buttonInfo;
const general_1 = require("../general");
const frontPageTitleBaseStyles = {
    fontFamily: general_1.E_Fonts.FONT_FAMILY,
    color: general_1.E_Colors.PRIMARY,
    fontSize: general_1.E_Fonts.BASIC_FONT_TITLE_SIZE,
    width: "100%",
    fontWeight: "600",
    marginTop: "20px",
    lineHeight: "1.1",
};
function frontPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function accountCollectionMainContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: 0,
        padding: ["10px", "10px 30px"],
    };
}
function accountCollectionInfoBox() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: "0 0 15px 0",
        padding: ["20px", "30px"],
        backgroundColor: "#fff",
    };
}
function accountCollectionInfoHeading() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_TITLE_SIZE,
        fontWeight: "bold",
        textAlign: "center",
        marginY: "10px",
    };
}
function accountCollectionInfoText() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        margin: "10px 0 15px 0",
    };
}
function accountCollectionEmailLink() {
    return {
        color: general_1.E_Colors.LINK,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        textAlign: "center",
        margin: 0,
    };
}
function collectionInfoItemContainer() {
    return {
        marginTop: "10px",
    };
}
function creditAgreementContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: 0,
        padding: ["20px", "30px"],
        backgroundColor: "#fff",
    };
}
function downloadButtonContainer() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };
}
function creditAgreementText() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        margin: "10px 0 15px 0",
        textAlign: "center",
        fontWeight: "bold",
    };
}
function mainContentContainer() {
    return {
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
    };
}
function nostoContainer() {
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
function nostoImage() {
    return {
        width: "87px",
        height: "61px",
    };
}
function nostoText() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "24px",
        fontWeight: "600",
        marginLeft: "20px",
    };
}
function loanInfoContainer() {
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
function loanInfoTitle() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_TITLE_SIZE,
        width: "100%",
        textAlign: "center",
        fontWeight: 600,
        marginTop: "20px",
        lineHeight: general_1.E_Fonts.BASIC_LINE_HEIGHT,
    };
}
function remainingCreditWrapper() {
    return {
        width: "100%",
        marginTop: "80px",
        textAlign: "center",
    };
}
function remainingCreditText() {
    return {
        color: general_1.E_Colors.PRIMARY,
    };
}
function remainingCreditAmount() {
    return {
        fontSize: general_1.E_Fonts.BASIC_FONT_TITLE_SIZE,
        margin: "10px 0 0 0",
    };
}
function balanceContainer() {
    return {
        width: "100%",
        padding: ["10px", "40px"],
    };
}
function percentageContainer() {
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
function creditWrapper() {
    return {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        fontSize: general_1.E_Fonts.SMALLER_FONT_SIZE,
    };
}
function creditUsed() {
    return {};
}
function creditTotal() {
    return {
        textAlign: "right",
    };
}
function creditText() {
    return {
        margin: "0 0 3px 0",
    };
}
function balanceInfo() {
    return {
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        margin: ["30px auto", "80px auto 0 auto"],
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        lineHeight: general_1.E_Fonts.BASIC_LINE_HEIGHT,
    };
}
function newsContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["100%", "100%", "224px"],
        background: "#fff",
        padding: "13px",
        marginX: ["16px", 0],
        order: [3, 2],
        height: ["auto", "auto", "550px"],
        overflowY: "scroll",
        scrollBehavior: "smooth",
    };
}
function creditRaiseContainer() {
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
function creditRaiseTitle() {
    return Object.assign(Object.assign({}, frontPageTitleBaseStyles), { textAlign: "center", display: "block" });
}
function creditRaiseWrapper() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
    };
}
function creditRaiseInputColumn() {
    return {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: ["100%", "405px"],
        paddingRight: [0, "10px"],
    };
}
function creditRaiseInputSectionWrapper() {
    return {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: ["100%", "fit-content"],
        paddingRight: [0, "10px"],
    };
}
function creditIncreaseInputRow() {
    return {
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
        marginBottom: "10px",
    };
}
function creditRaiseInput() {
    return {
        width: "280px",
        border: "solid 1px #5c98d3",
        height: "32px",
        padding: "10px 68px 8px 11px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        backgroundColor: "#fff",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
    };
}
function creditRaiseInputWrapper() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    };
}
function creditRaiseInputError() {
    return {
        width: "100%",
        color: general_1.E_Colors.ERROR,
    };
}
function creditRaiseEuroSign(props) {
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
function creditRaiseInfoColumn() {
    return {
        marginTop: ["40px"],
    };
}
function creditRaiseText({ textAlign }) {
    return {
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        marginLeft: "10px",
        textAlign,
    };
}
function rulesContainer() {
    return {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    };
}
function errorMessage() {
    return {
        color: "red",
        width: "300px",
    };
}
function notEligibleReasonContainer() {
    return {
        color: "red",
        width: "300px",
        textAlign: "left",
    };
}
function baseWithdrawButton(props) {
    return {
        width: "150px",
        borderRadius: "5px",
        padding: "7px 0",
        border: "none",
        display: "block",
    };
}
function withdrawButton(props) {
    return Object.assign(Object.assign({}, baseWithdrawButton()), { background: "linear-gradient(0deg, rgba(79,169,60,1) 0%, rgba(133,184,117,1.30) 50%, rgba(79,169,60,1) 100%)", ":hover": {
            background: "linear-gradient(0deg, rgba(141,199,126,1) 0%, rgba(174,222,138,1) 50%, rgba(141,199,126,1) 100%)",
            cursor: "pointer",
        }, ":active": {
            background: "linear-gradient(0deg, rgba(109,185,104,1) 0%, rgba(142,209,119,1.35) 50%, rgba(109,185,104,1) 100%)",
            cursor: "pointer",
        }, ":disabled": {
            background: "#b0b0b0",
            cursor: "none",
        } });
}
function withdrawDisabledButton(props) {
    return Object.assign(Object.assign({}, baseWithdrawButton()), { background: "linear-gradient(0deg,rgba(148,151,147) 0%,rgb(195 197 194) 50%,rgba(148,151,147,1) 100%)", ":hover": {
            background: "linear-gradient(0deg,rgba(140,141,139) 0%,rgb(175 180 174) 50%,rgba(140,141,139,1) 100%)",
            cursor: "pointer",
        }, ":active": {
            background: "linear-gradient(0deg, rgba(109,185,104,1) 0%, rgba(142,209,119,1.35) 50%, rgba(109,185,104,1) 100%)",
            cursor: "pointer",
        }, ":disabled": {
            background: "#b0b0b0",
            cursor: "none",
        } });
}
function buttonInfo() {
    return {
        width: "300px",
    };
}
//# sourceMappingURL=frontPage.styles.js.map