"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommonLayoutRules = getCommonLayoutRules;
exports.rootGrid = rootGrid;
exports.fullWidthGrid = fullWidthGrid;
exports.mainContentGrid = mainContentGrid;
const general_1 = require("../general");
function getCommonLayoutRules() {
    return {
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: ["column", "row"],
    };
}
function rootGrid() {
    return {
        marginBottom: "56px",
    };
}
function fullWidthGrid() {
    const commonRules = getCommonLayoutRules();
    return Object.assign(Object.assign({}, commonRules), { marginBottom: ["20px", "38px"], maxWidth: "100%" });
}
function mainContentGrid() {
    const commonRules = getCommonLayoutRules();
    return Object.assign(Object.assign({}, commonRules), { marginBottom: "56px", maxWidth: "960px", fontFamily: general_1.E_Fonts.FONT_FAMILY, fontSize: general_1.E_Fonts.BASIC_FONT_SIZE, color: general_1.E_Fonts.BASIC_FONT_COLOR, lineHeight: general_1.E_Fonts.BASIC_LINE_HEIGHT });
}
//# sourceMappingURL=layout.styles.js.map