"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPageRootStyles = userPageRootStyles;
exports.userPageContainer = userPageContainer;
exports.userPageFlexContainer = userPageFlexContainer;
exports.userPageColumn = userPageColumn;
exports.userPageTextGroup = userPageTextGroup;
exports.userPageTextButtonGroup = userPageTextButtonGroup;
exports.userPageButtonGroup = userPageButtonGroup;
exports.userPageAddressColumn = userPageAddressColumn;
exports.formError = formError;
exports.inputContainer = inputContainer;
exports.textField = textField;
exports.titleAndEditButtonContainer = titleAndEditButtonContainer;
const general_1 = require("../general");
function userPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function userPageContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["auto", "100%"],
        backgroundColor: "#fff",
        padding: "2px 28px 34px 28px",
        marginBottom: ["20px", "16px"],
    };
}
function userPageFlexContainer() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
    };
}
function userPageColumn() {
    return {
        width: ["100%", "50%"],
    };
}
function userPageTextGroup() {
    return {
        display: "flex",
        flexDirection: "column",
    };
}
function userPageTextButtonGroup() {
    return {
        width: "250px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    };
}
function userPageButtonGroup() {
    return {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 0,
        padding: 0,
    };
}
function userPageAddressColumn() {
    return {
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
    };
}
function formError() {
    return {
        color: general_1.E_Colors.ERROR,
    };
}
function inputContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: ["100%", "50%"],
        marginTop: ["10px", 0],
    };
}
function textField() {
    return {
        width: "250px",
        height: "32px",
        margin: "10px 0 10px 0",
        padding: "8px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        border: "solid 1px #5c98d3",
        backgroundColor: "#ffffff",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
    };
}
function titleAndEditButtonContainer() {
    return {
        width: ["auto", "100%"],
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };
}
//# sourceMappingURL=userPage.styles.js.map