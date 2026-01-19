"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPageNotice = startPageNotice;
exports.startPageNoticeContainer = startPageNoticeContainer;
exports.startPageRootStyles = startPageRootStyles;
exports.startPagePathDivider = startPagePathDivider;
exports.startPagePathDividerText = startPagePathDividerText;
exports.startPageApplicationPath = startPageApplicationPath;
exports.startPagePathHeading = startPagePathHeading;
exports.startPagePathText = startPagePathText;
exports.startPageLoginPath = startPageLoginPath;
exports.startPageNoticeListContainer = startPageNoticeListContainer;
exports.startPageContainer = startPageContainer;
exports.bankIdContainer = bankIdContainer;
exports.startPageContentStyles = startPageContentStyles;
exports.startPageBank = startPageBank;
exports.startPageBankContainer = startPageBankContainer;
const __1 = require("..");
const general_1 = require("../general");
function startPageNotice() {
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
function startPageNoticeContainer(props) {
    const backgroundColor = props.label === "Alert"
        ? `rgba(245,212,29, 0.04)`
        : props.label === "Critical"
            ? `rgba(255,0,0,0.04)`
            : `rgba(18,72,0144,0.04)`;
    const border = props.label === "Alert"
        ? `1px solid ${__1.E_Colors.WARNING}`
        : props.label === "Critical"
            ? `1px solid ${__1.E_Colors.ERROR}`
            : `1px solid ${general_1.E_Fonts.BASIC_FONT_COLOR}`;
    return {
        display: "flex",
        width: ["auto", "100%"],
        background: "#ffffff",
        backgroundColor: backgroundColor,
        padding: ["10px 20px", "10px 22px"],
        marginBottom: ["20px", "16px"],
        marginX: ["16px", "0px"],
        justifyContent: "center",
        alignContent: "center",
        border: border,
    };
}
function startPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function startPagePathDivider() {
    return {
        display: ["none", "inline"],
        width: "1.5px",
        backgroundColor: "#ABABAB",
        color: "grey",
        height: "100%",
    };
}
function startPagePathDividerText() {
    return {
        textAlign: "center",
        display: ["inline", "none"],
        padding: 0,
        marginY: "30px",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: ["18px", "18px"],
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
    };
}
function startPageApplicationPath() {
    return {
        width: ["100%", "49%"],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };
}
function startPagePathHeading() {
    return {
        display: "flex",
        padding: 0,
        margin: ["0 0 20px 0", "0 0 40px 0"],
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: ["20px", "20px"],
        fontWeight: "bold",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        textAlign: "center",
    };
}
function startPagePathText() {
    return {
        display: "flex",
        padding: 0,
        marginBottom: "10px",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: ["18px", "18px"],
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        textAlign: "center",
    };
}
function startPageLoginPath() {
    return {
        width: ["100%", "49%"],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };
}
function startPageNoticeListContainer() {
    return {
        display: "flex",
        flexDirection: "column",
    };
}
function startPageContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        backgroundColor: ["", "#ffffff"],
        padding: ["0px", "50px"],
    };
}
function bankIdContainer() {
    return {
        display: "flex",
        justifyContent: "center",
    };
}
function startPageContentStyles() {
    return {
        display: "flex",
        width: ["100%", "680px"],
        alignSelf: "center",
        flexWrap: "wrap",
        paddingX: ["16px", "0px"],
    };
}
function startPageBank() {
    return {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "solid 1px #cee1f3",
        backgroundColor: "#ffffff",
        borderRadius: "6px",
        height: "93px",
        minWidth: ["100%", "330px"],
        marginBottom: "20px",
        "&:nth-child(odd)": {
            marginRight: ["10px6px", "20px"],
        },
        ":hover": {
            border: "solid 1px #5c98d3",
            cursor: "pointer",
        },
    };
}
function startPageBankContainer(properties) {
    return {
        display: "flex",
        backgroundColor: "#ffffff",
        backgroundImage: `url(${properties.url})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        height: `${properties.height}`,
        width: `${properties.width}`,
    };
}
//# sourceMappingURL=startPage.styles.js.map