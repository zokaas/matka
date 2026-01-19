"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleBox = titleBox;
exports.pageTitle = pageTitle;
const general_1 = require("../general");
function titleBox() {
    return {
        display: "flex",
        width: ["auto", "100%"],
        height: "100%",
        backgroundColor: "#ffffff",
        paddingY: ["20px", "29px"],
        marginBottom: ["20px", "16px"],
        marginX: ["16px", "0px"],
        justifyContent: "center",
        alignContent: "center",
    };
}
function pageTitle() {
    return {
        display: "flex",
        padding: 0,
        margin: 0,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: ["24px", "24px"],
        fontWeight: "bold",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        textAlign: "center",
    };
}
//# sourceMappingURL=pageTitle.styles.js.map