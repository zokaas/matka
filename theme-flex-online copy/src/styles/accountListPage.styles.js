"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountListPageRootStyles = accountListPageRootStyles;
exports.accountListContainerStyles = accountListContainerStyles;
exports.accountStyle = accountStyle;
exports.accountListButtonContainer = accountListButtonContainer;
function accountListPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function accountListContainerStyles() {
    return {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: ["0", "30px 0 50px 0"],
        backgroundColor: ["none", "white"],
        textAlign: "center",
    };
}
function accountStyle() {
    return {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
    };
}
function accountListButtonContainer() {
    return {
        display: "flex",
        width: ["290px", "330px"],
        height: "93px",
        margin: "10px",
    };
}
//# sourceMappingURL=accountListPage.styles.js.map