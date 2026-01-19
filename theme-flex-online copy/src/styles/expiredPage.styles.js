"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expiredPageRootStyles = expiredPageRootStyles;
exports.contentContainer = contentContainer;
exports.heading = heading;
exports.content = content;
exports.link = link;
const general_1 = require("../general");
function expiredPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function contentContainer() {
    return {
        display: "flex",
        backgroundColor: "#fff",
        width: ["auto", "100%"],
        marginX: ["16px", "0px"],
        padding: "30px",
        flexDirection: "column",
        alignItems: "center",
    };
}
function heading() {
    return {
        fontSize: "24px",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    };
}
function content() {
    return {
        fontSize: "18px",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        lineHeight: "1.1",
        textAlign: "center",
    };
}
function link() {
    return {
        color: general_1.E_Colors.LINK,
    };
}
//# sourceMappingURL=expiredPage.styles.js.map