"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontBoxTitle = fontBoxTitle;
exports.fontBoldedText = fontBoldedText;
exports.fontBoldedTextSpan = fontBoldedTextSpan;
exports.fontAmountHeading = fontAmountHeading;
exports.fontContentText = fontContentText;
exports.fontFooterTitle = fontFooterTitle;
exports.fontFooterText = fontFooterText;
exports.fontUserPageTitle = fontUserPageTitle;
exports.fontUserBoxTitle = fontUserBoxTitle;
const general_1 = require("../general");
function fontBoxTitle() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_TITLE_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontWeight: 600,
        padding: 0,
        margin: "31px 0 0 0",
        textAlign: "center",
    };
}
function fontBoldedText() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        padding: 0,
        margin: "24px 0 0 0",
    };
}
function fontBoldedTextSpan() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        padding: 0,
        margin: "0 10px 0 0",
    };
}
function fontAmountHeading() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_TITLE_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
    };
}
function fontContentText(alert = false) {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: alert ? general_1.E_Colors.ERROR : general_1.E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
        fontWeight: "normal",
    };
}
function fontFooterTitle() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: "#66aadf",
        fontWeight: "bold",
        margin: "0",
        padding: "0",
        marginBottom: ["24px"],
    };
}
function fontFooterText() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.SMALLER_FONT_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
        margin: "0 0 5px 0",
        fontWeight: "normal",
    };
}
function fontUserPageTitle() {
    return {
        textAlign: ["left", "center"],
        marginBottom: "20px",
        paddingTop: ["12px", "19px"],
    };
}
function fontUserBoxTitle() {
    const commonRules = fontBoldedText();
    return Object.assign(Object.assign({}, commonRules), { fontSize: "18px" });
}
//# sourceMappingURL=fonts.styles.js.map