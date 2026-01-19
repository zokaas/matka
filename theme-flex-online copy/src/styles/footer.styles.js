"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footer = footer;
exports.footerColumn = footerColumn;
exports.footerRow = footerRow;
exports.footerIconWrapper = footerIconWrapper;
exports.footerLink = footerLink;
const general_1 = require("../general");
const txtNormal = {
    fontFamily: general_1.E_Fonts.FONT_FAMILY,
    color: general_1.E_Fonts.BASIC_FONT_COLOR,
    fontWeight: "normal",
    margin: "0",
    padding: "0",
    lineHeight: "1.5",
    fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
};
function footer() {
    return {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "white",
        py: ["40px", "48px"],
        pl: ["0", "0", "150px"],
        width: "100%",
    };
}
function footerColumn() {
    return {
        display: "flex",
        flexDirection: "column",
        ml: ["30px", "30px", "0"],
    };
}
function footerRow() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontSize: general_1.E_Fonts.SMALLER_FONT_SIZE,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: "12px",
    };
}
function footerIconWrapper() {
    return Object.assign(Object.assign({}, txtNormal), { marginRight: "14px", minWidth: "24px", alignItems: "center", display: "inline-flex", fontSize: "10px" });
}
function footerLink() {
    return Object.assign(Object.assign({}, txtNormal), { fontSize: general_1.E_Fonts.SMALLER_FONT_SIZE });
}
//# sourceMappingURL=footer.styles.js.map