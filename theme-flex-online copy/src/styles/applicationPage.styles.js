"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageRootStyles = pageRootStyles;
exports.formSection = formSection;
exports.formHeading = formHeading;
exports.trustPilotSection = trustPilotSection;
exports.tpHeading = tpHeading;
const general_1 = require("../general");
function pageRootStyles() {
    return {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: 0,
        margin: 0,
    };
}
function formSection() {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["100%", "64%"],
        backgroundColor: "#fff",
        padding: 0,
        margin: 0,
    };
}
function formHeading() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Colors.PRIMARY,
    };
}
function trustPilotSection() {
    return {
        display: ["none", "flex"],
        flexDirection: "column",
        width: "35%",
        backgroundColor: "rgb(3, 103, 166)",
        padding: "15px",
    };
}
function tpHeading() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: "#fff",
    };
}
//# sourceMappingURL=applicationPage.styles.js.map