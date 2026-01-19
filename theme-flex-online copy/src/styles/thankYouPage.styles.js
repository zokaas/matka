"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thankYouPageRootStyles = thankYouPageRootStyles;
exports.thankYouPageContainer = thankYouPageContainer;
exports.thankYouPageLink = thankYouPageLink;
exports.thankYouPageContent = thankYouPageContent;
exports.thankYouPagePhoneText = thankYouPagePhoneText;
exports.thankYouPageTitle = thankYouPageTitle;
function thankYouPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function thankYouPageContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
    };
}
function thankYouPageLink() {
    return {
        color: "#5c98d3",
        display: "inline-block",
    };
}
function thankYouPageContent() {
    return {
        margin: ["15px 10px", "20px 200px 0 200px "],
        padding: ["0 0 20px 0", "0"],
        textAlign: "center",
    };
}
function thankYouPagePhoneText() {
    return {
        margin: ["0 10px 45px", "0 200px 33px"],
        textAlign: "center",
    };
}
function thankYouPageTitle() {
    return {
        textAlign: "center",
        fontWeight: "600",
        fontSize: "24px",
        paddingTop: ["11px", "40px"],
        margin: ["0 35px", "0 60px"],
    };
}
//# sourceMappingURL=thankYouPage.styles.js.map