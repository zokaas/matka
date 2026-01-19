"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noLoanPageRootStyles = noLoanPageRootStyles;
exports.noLoanPageContainer = noLoanPageContainer;
exports.NoLoanPageLink = NoLoanPageLink;
exports.NoLoanPageContent = NoLoanPageContent;
exports.NoLoanPageTitle = NoLoanPageTitle;
function noLoanPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function noLoanPageContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
    };
}
function NoLoanPageLink() {
    return {
        color: "#5c98d3",
        display: "inline-block",
    };
}
function NoLoanPageContent() {
    return {
        margin: ["15px 10px", "20px 200px 33px 200px "],
        padding: ["0 0 45px 0", "0"],
        textAlign: "center",
    };
}
function NoLoanPageTitle() {
    return {
        textAlign: "center",
        fontWeight: "600",
        fontSize: "24px",
        paddingTop: ["11px", "40px"],
        margin: ["0 35px", "0 60px"],
    };
}
//# sourceMappingURL=noLoanPage.styles.js.map