"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutPageRootStyles = logoutPageRootStyles;
exports.pageContent = pageContent;
exports.content = content;
exports.link = link;
const __1 = require("..");
const general_1 = require("../general");
function logoutPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function pageContent() {
    return {
        paddingX: "40px",
        width: ["auto", "100%"],
        marginX: ["16px", "0px"],
        backgroundColor: "#fff",
    };
}
function content() {
    return {
        width: "100%",
        color: __1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        textAlign: "center",
        lineHeight: 1.5,
    };
}
function link() {
    return {
        color: __1.E_Colors.LINK,
        textDecoration: "underline",
    };
}
//# sourceMappingURL=logoutPage.styles.js.map