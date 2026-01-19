"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycNotice = kycNotice;
exports.kycNoticeContainer = kycNoticeContainer;
const general_1 = require("../general");
function kycNotice() {
    return {
        display: "flex",
        padding: 0,
        margin: 0,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.SMALLER_FONT_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        textAlign: "left",
        whiteSpace: "pre-wrap",
    };
}
function kycNoticeContainer() {
    console.log('E_Colors.ERROR value:', general_1.E_Colors.ERROR);
    return {
        display: "flex",
        width: ["auto", "100%"],
        background: "#ffffff",
        backgroundColor: "rgba(255,0,0,0.04)",
        padding: ["10px 20px", "10px 22px"],
        marginBottom: ["20px", "16px"],
        marginX: ["16px", "0px"],
        justifyContent: "center",
        alignContent: "center",
        border: `1px solid ${general_1.E_Colors.ERROR} !important`,
        borderColor: `${general_1.E_Colors.ERROR} !important`,
    };
}
//# sourceMappingURL=kycNotice.styles.js.map