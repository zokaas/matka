"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableLayout = tableLayout;
exports.tableHeaders = tableHeaders;
exports.tableCell = tableCell;
exports.tableRows = tableRows;
exports.tablePaginator = tablePaginator;
const general_1 = require("../general");
function tableLayout() {
    return {};
}
function tableHeaders() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
    };
}
function tableCell() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
    };
}
function tableRows() {
    return {};
}
function tablePaginator() {
    return {};
}
//# sourceMappingURL=tableStyles.styles.js.map