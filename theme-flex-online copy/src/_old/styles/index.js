"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyTitle = bodyTitle;
exports.box = box;
exports.contentBox = contentBox;
exports.headerContainer = headerContainer;
exports.headerContent = headerContent;
exports.headerTitle = headerTitle;
exports.largeButton = largeButton;
exports.loginButtonTextStyle = loginButtonTextStyle;
exports.pageTitle = pageTitle;
exports.footerContainer = footerContainer;
exports.body = body;
exports.userInfoContent = userInfoContent;
exports.userInfoTitle = userInfoTitle;
exports.textItem = textItem;
exports.secondaryButton = secondaryButton;
exports.secondaryButtonText = secondaryButtonText;
exports.bodyLabel = bodyLabel;
exports.bodyWarning = bodyWarning;
exports.mobilePageTitle = mobilePageTitle;
exports.textField = textField;
exports.select = select;
exports.checkbox = checkbox;
exports.checkboxDisabled = checkboxDisabled;
exports.checkboxText = checkboxText;
exports.button = button;
exports.buttonText = buttonText;
exports.formError = formError;
exports.link = link;
exports.headerLink = headerLink;
exports.sideBox = sideBox;
exports.breadcrumbBox = breadcrumbBox;
exports.inlineBox = inlineBox;
exports.sideTitle = sideTitle;
exports.sideLink = sideLink;
exports.breadcrumbTitle = breadcrumbTitle;
exports.buttonInfo = buttonInfo;
exports.buttonCancel = buttonCancel;
exports.buttonSubmit = buttonSubmit;
exports.buttonSubmitDisabled = buttonSubmitDisabled;
exports.buttonLogout = buttonLogout;
exports.buttonLoginAgain = buttonLoginAgain;
function bodyTitle(props) {
    return Object.assign({ display: "flex", fontFamily: "arial", fontSize: ["20px", "24px"], fontWeight: "bold", lineHeight: "1.5", color: "#0c445c", padding: ["16px", "24px 0"] }, ((props === null || props === void 0 ? void 0 : props.isTextCentered) && { textAlign: "center" }));
}
function box(props) {
    return Object.assign(Object.assign({ display: "flex", width: "100%", height: "100%", borderRadius: "8px", boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)", backgroundColor: "#fdfdfd", backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)" }, ((props === null || props === void 0 ? void 0 : props.isCentered) && {
        justifyContent: "center",
        alignItems: "center",
    })), ((props === null || props === void 0 ? void 0 : props.flexDirection) && {
        flexDirection: props.flexDirection,
    }));
}
function contentBox() {
    return {
        marginTop: ["16px", "30px"],
        marginBottom: ["40px", "80px"],
    };
}
function headerContainer() {
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: ["50px", "76px"],
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#f9f9f9",
    };
}
function headerContent() {
    return {
        maxWidth: "976px",
        width: "100%",
        height: "100%",
        padding: ["12px 0 12px 20px", "25px 25px 25px 40px"],
        display: "flex",
        flexDirection: "row",
    };
}
function headerTitle() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "18px",
        fontWeight: "400",
        lineHeight: "1.3",
        color: "#0c445c",
        padding: "0 0 6px 40px",
    };
}
function largeButton(props) {
    return Object.assign(Object.assign({ color: "#0c445c", borderRadius: "5px", backgroundColor: "#fff", fontFamily: "arial", border: "0", boxShadow: "0 2px 2px 0 rgba(12, 68, 92, 0.5)", cursor: "pointer" }, ((props === null || props === void 0 ? void 0 : props.isLogin) && { width: "212px", height: "172px" })), { "&:hover": {
            boxShadow: "0 2px 2px 0 #2bace2",
        }, "&:active": {
            backgroundColor: "#f6fafc",
            boxShadow: "0 2px 2px 0 #2bace2",
        }, "&:disabled": {
            opacity: 0.5,
            boxShadow: "0 2px 2px 0 rgba(12, 68, 92, 0.5)",
            backgroundColor: "#fff",
            cursor: "default",
        } });
}
function loginButtonTextStyle() {
    return {
        textAlign: "center",
        fontFamily: "arial",
        fontSize: "16px",
        color: "#0c445c",
        fontWeight: "normal",
        margin: "0 0 16px 0",
        padding: "0",
        lineHeight: "1.5",
    };
}
function pageTitle(props) {
    return Object.assign({ display: "flex", fontFamily: "arial", fontSize: ["26px", "32px"], fontWeight: "bold", color: "#0c445c", padding: ["16px", "22px 0"] }, ((props === null || props === void 0 ? void 0 : props.isTextCentered) && { textAlign: "center" }));
}
function footerContainer() {
    return {
        display: "flex",
        flexDirection: "column",
    };
}
function body() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 4px 0",
    };
}
function userInfoContent() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 14px 0",
    };
}
function userInfoTitle() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "bold",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: 0,
    };
}
function textItem() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 14px 0",
        "::before": {
            content: `"\\2022"`,
            color: "#d297ca",
            marginRight: "8px",
        },
    };
}
function secondaryButton() {
    return {
        border: "none",
        padding: "8px 25px",
        borderRadius: "16px",
        backgroundColor: "#d297ca",
        opacity: "1",
        marginBottom: "16px",
        ":hover": {
            opacity: "0.75",
        },
        ":active": {
            opacity: 1,
            backgroundColor: "#b884b1",
        },
        ":disabled": {
            backgroundColor: "#d2c7d1",
        },
    };
}
function secondaryButtonText() {
    return {
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#ffffff",
        letterSpacing: "0.5px",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
        margin: 0,
        padding: 0,
    };
}
function bodyLabel() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 6px 0",
    };
}
function bodyWarning() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#664a62",
        padding: "0 0 4px 0",
    };
}
function mobilePageTitle() {
    return {
        fontFamily: "'Baloo 2'",
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "2",
        color: "#71789b",
    };
}
function textField() {
    return {
        border: "0",
        borderRadius: "4px",
        boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        color: "#0c445c",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        width: "240px",
        height: "36px",
        padding: "6px 8px 6px 8px",
        margin: "0",
        "&::placeholder": {
            color: "#737373",
        },
    };
}
function select() {
    return {
        border: "0",
        borderRadius: "4px",
        boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        color: "#737373",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        width: "100%",
        height: "36px",
        padding: "0 8px 0 8px",
        margin: "0",
        cursor: "pointer",
        appearance: "none",
    };
}
function checkbox() {
    return {
        width: "24px",
        height: "24px",
        borderRadius: "4px",
        border: "solid 2px #979797",
        boxShadow: "2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset 0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    };
}
function checkboxDisabled() {
    return {
        width: "24px",
        height: "24px",
        borderRadius: "4px",
        border: "solid 2px #979797",
        boxShadow: "2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset 0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#d9d9d9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
}
function checkboxText() {
    return {
        fontFamily: "basic",
        fontSize: "16px",
        fontWeight: "400",
        color: "#0c445c",
        padding: "0 0 0 8px",
    };
}
function button() {
    return {
        border: "0px",
        borderRadius: "5px",
        backgroundColor: "transparent",
        backgroundImage: "linear-gradient(to top, #59b268, #afe681)",
        height: "34px",
        "&:hover": {
            backgroundImage: "linear-gradient(to top, rgba(89, 178, 104, 0.7), rgba(175, 230, 129, 0.7));",
        },
    };
}
function buttonText() {
    return {
        fontFamily: "basic",
        fontWeight: "bold",
        fontSize: "16px",
        color: "#fff",
        textTransform: "uppercase",
    };
}
function formError() {
    return {
        fontFamily: "basic",
        fontWeight: "bold",
        fontSize: "14px",
        color: "darkred",
        padding: "8px 0 0 0",
    };
}
function link() {
    return {
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "bold",
        lineHeight: "1.5",
        color: "#196da8",
        cursor: "pointer",
    };
}
function headerLink() {
    return {
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#196da8",
        cursor: "pointer",
        textDecoration: "underline",
    };
}
function sideBox() {
    return {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fdfdfd",
        backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)",
        padding: "32px 32px 32px 32px",
    };
}
function breadcrumbBox() {
    return {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fdfdfd",
        backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)",
        padding: ["12px", "32px"],
    };
}
function inlineBox() {
    return {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fdfdfd",
        backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)",
        padding: "18px 16px 18px 16px",
        margin: "0 0 16px 0",
    };
}
function sideTitle() {
    return {
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily: "'Baloo 2', cursive",
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: "1.5",
        color: "#8f6789",
        padding: "0 0 16px 0",
    };
}
function sideLink() {
    return {
        color: "#8f6789",
        textDecoration: "none",
        "&:hover": {
            color: "#8f6789",
            textDecoration: "none",
        },
    };
}
function breadcrumbTitle() {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: ["0 10px 4px 0", "0 40px 0 0"],
        "&:first-of-type": {
            marginLeft: [0, "64px"],
        },
    };
}
function buttonInfo() {
    return {
        border: "0",
        borderRadius: "5px",
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#d8d8d8",
        color: "#5e5e5e",
        letterSpacing: "1.5",
        fontFamily: "arial",
        fontSize: "16px",
        padding: "8px 16px 8px 16px",
        margin: "0",
    };
}
function buttonCancel() {
    return {
        width: "150px",
        height: "40px",
        border: "0",
        borderRadius: "4px",
        boxShadow: "2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset 0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#fff",
        fontFamily: "arial",
        fontSize: "16px",
        color: "#cc0000",
    };
}
function buttonSubmit() {
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "240px",
        height: "64px",
        border: "0",
        borderRadius: "32px",
        backgroundColor: "#ade6c8",
        textShadow: "0 1px 2px rgba(0,0,0,0.30)",
        fontFamily: "arial",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#fff",
        margin: "0 0 32px 0",
        cursor: "pointer",
    };
}
function buttonSubmitDisabled() {
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "240px",
        height: "64px",
        border: "0",
        borderRadius: "32px",
        backgroundColor: "#CECECE",
        fontFamily: "arial",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#545454",
        margin: "0 0 32px 0",
        cursor: "not-allowed",
    };
}
function buttonLogout() {
    return {
        height: "38px",
        margin: "0",
        padding: "8px 11px",
        fontFamily: "arial",
        fontSize: "14px",
        letterSpacing: "-0.5px",
        color: "#085772",
        borderRadius: "5px",
        border: "solid 1px #085772",
        backgroundColor: "#fff",
        cursor: "pointer",
        "&:hover": {
            color: "#d297ca",
            border: "solid 1px #d297ca",
        },
    };
}
function buttonLoginAgain() {
    return {
        margin: "0",
        marginLeft: "8px",
        marginRight: ["8px", "0px"],
        fontFamily: "arial",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "#d297ca",
        textTransform: "uppercase",
        borderRadius: "5px",
        border: "0px",
        cursor: "pointer",
        height: "32px",
        padding: "0px 4px",
        "&:hover": {
            opacity: 0.75,
        },
        "&:active": {
            backgroundColor: "#b884b1",
        },
    };
}
//# sourceMappingURL=index.js.map