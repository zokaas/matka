"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerStyles = headerStyles;
exports.headerContainer = headerContainer;
exports.mobileNavText = mobileNavText;
exports.mobileNavMoreTitle = mobileNavMoreTitle;
exports.mobileNavMoreClose = mobileNavMoreClose;
exports.mobileNavMoreItemsHeading = mobileNavMoreItemsHeading;
exports.mobileNavMoreLink = mobileNavMoreLink;
exports.mobileNavMoreItemText = mobileNavMoreItemText;
const general_1 = require("../general");
const layout_styles_1 = require("./layout.styles");
function headerStyles() {
    const commonRules = (0, layout_styles_1.getCommonLayoutRules)();
    return Object.assign(Object.assign({}, commonRules), { width: ["100%", "940px"], justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", flexDirection: "row" });
}
function headerContainer() {
    const commonRules = (0, layout_styles_1.getCommonLayoutRules)();
    return Object.assign(Object.assign({}, commonRules), { backgroundColor: "#fff", paddingTop: "23px", paddingBottom: "19px", paddingX: "20px" });
}
function mobileNavText(props) {
    return {
        color: props.color,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "13px",
    };
}
function mobileNavMoreTitle() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontWeight: "bold",
        fontSize: "18px",
    };
}
function mobileNavMoreClose() {
    return {
        color: "#2d73b5",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontWeight: "bold",
        fontSize: "20px",
        margin: 0,
    };
}
function mobileNavMoreItemsHeading() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "18px",
        margin: "10px 0 0",
        fontWeight: "normal",
        fontStretch: "normal",
        lineHeight: "0.67",
        textAlign: "center",
    };
}
function mobileNavMoreLink() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "18px",
        margin: "0 0 30px",
        fontWeight: "normal",
        fontStretch: "normal",
        lineHeight: "0.67",
        textAlign: "center",
    };
}
function mobileNavMoreItemText() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "18px",
        marginLeft: "16px",
        width: "200px",
        textAlign: "left",
    };
}
//# sourceMappingURL=header.styles.js.map