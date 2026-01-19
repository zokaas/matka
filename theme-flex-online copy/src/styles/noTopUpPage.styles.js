"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoTopUpPageRootStyles = NoTopUpPageRootStyles;
exports.NoTopUpPageTitleContainer = NoTopUpPageTitleContainer;
exports.NoTopUpPageTitleText = NoTopUpPageTitleText;
exports.NoTopUpPageContainer = NoTopUpPageContainer;
exports.NoTopUpPageText = NoTopUpPageText;
exports.containerInfo = containerInfo;
exports.containerInfoList = containerInfoList;
exports.NoTopUpPageLink = NoTopUpPageLink;
exports.NoTopUpPageContactInfo = NoTopUpPageContactInfo;
exports.NoTopUpPageContent = NoTopUpPageContent;
exports.NoTopUpPageTitle = NoTopUpPageTitle;
function NoTopUpPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function NoTopUpPageTitleContainer() {
    return {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
        padding: ["20px 0", "29px"],
        marginBottom: ["16px"],
    };
}
function NoTopUpPageTitleText() {
    return {
        fontSize: ["21px", "24px"],
        fontWeight: "bold",
    };
}
function NoTopUpPageContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        width: "100%",
        backgroundColor: "white",
        padding: ["0", "20px"],
    };
}
function NoTopUpPageText() {
    return {
        marginLeft: " 8px",
        textAlign: "left",
    };
}
function containerInfo() {
    return {
        display: "flex",
        margin: ["10px", "5px"],
        alignItems: "center",
        justifyContent: "flex-start",
    };
}
function containerInfoList() {
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        margin: "auto",
    };
}
function NoTopUpPageLink() {
    return {
        color: "#5c98d3",
        textAlign: "center",
    };
}
function NoTopUpPageContactInfo() {
    return {
        textAlign: "center",
        marginTop: "8px",
    };
}
function NoTopUpPageContent() {
    return {
        margin: ["10px 0", "20px 50px"],
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
    };
}
function NoTopUpPageTitle() {
    return {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "16px",
        padding: "11px",
        margin: ["0 35px", "0 10px"],
    };
}
//# sourceMappingURL=noTopUpPage.styles.js.map