"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactPageRootStyles = contactPageRootStyles;
exports.contactPageInfoContainer = contactPageInfoContainer;
exports.contactPageTextWrapper = contactPageTextWrapper;
exports.contactPageInfoBox = contactPageInfoBox;
exports.contactPageLinkFaq = contactPageLinkFaq;
exports.contactPageLink = contactPageLink;
exports.contactPageLinkEmail = contactPageLinkEmail;
const __1 = require("..");
function contactPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function contactPageInfoContainer() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        marginX: ["16px", "0px"],
        lineHeight: __1.E_Fonts.BASIC_LINE_HEIGHT,
    };
}
function contactPageTextWrapper() {
    return {
        margin: "2px 0",
    };
}
function contactPageInfoBox() {
    return {
        width: ["100%", "472px"],
        height: "100%",
        padding: ["0 24px 24px 24px"],
        backgroundColor: "#fff",
        textAlign: ["left", "center"],
        "&:first-child": {
            marginRight: ["0", "16px"],
            marginBottom: ["16px", "0"],
        },
    };
}
function contactPageLinkFaq() {
    return {
        color: "#5c98d3",
        marginTop: "6px",
        display: "inline-block",
    };
}
function contactPageLink() {
    return {
        color: "#5c98d3",
        display: "inline-block",
    };
}
function contactPageLinkEmail() {
    return {
        color: "#5c98d3",
        textDecoration: "none",
    };
}
//# sourceMappingURL=contactPage.styles.js.map