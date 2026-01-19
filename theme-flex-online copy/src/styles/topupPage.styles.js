"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topupPageRootStyles = topupPageRootStyles;
exports.applicationContainer = applicationContainer;
exports.formTitle = formTitle;
exports.formDescription = formDescription;
exports.formSection = formSection;
exports.sectionTitle = sectionTitle;
exports.formItemContainer = formItemContainer;
exports.formLabel = formLabel;
exports.euroSign = euroSign;
exports.inputContainer = inputContainer;
exports.inputContainerDropdown = inputContainerDropdown;
exports.formItemCheckBoxContainer = formItemCheckBoxContainer;
exports.formLabelCheckBox = formLabelCheckBox;
exports.inputContainerCheckbox = inputContainerCheckbox;
exports.userInfo = userInfo;
exports.textField = textField;
exports.textArea = textArea;
exports.select = select;
exports.singleValue = singleValue;
exports.singleOption = singleOption;
exports.menu = menu;
exports.checkbox = checkbox;
exports.checkboxDisabled = checkboxDisabled;
exports.checkboxText = checkboxText;
exports.formError = formError;
exports.formBottomError = formBottomError;
exports.bottomContainer = bottomContainer;
exports.link = link;
exports.goBack = goBack;
exports.contentHeading = contentHeading;
exports.contentText = contentText;
const general_1 = require("../general");
function topupPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
function applicationContainer() {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["auto", "100%"],
        backgroundColor: "#fff",
        padding: "22px 28px",
    };
}
function formTitle() {
    return {
        fontSize: "24px",
        textAlign: ["center", "left"],
        fontWeight: "600",
        marginBottom: "18px",
        lineHeight: 1.1,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Colors.PRIMARY,
    };
}
function formDescription() {
    return {
        textAlign: "left",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Colors.PRIMARY,
        marginBottom: "20px",
    };
}
function formSection() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginY: "20px",
        paddingX: ["25px", "15px"],
    };
}
function sectionTitle() {
    return {
        textAlign: "left",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Colors.PRIMARY,
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "30px",
    };
}
function formItemContainer() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: ["column", "row"],
        marginBottom: "28px",
        alignItems: ["flex-start", "center"],
        justifyContent: "space-between",
    };
}
function formLabel() {
    return {
        width: ["100%", "40%"],
        textAlign: "left",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Colors.PRIMARY,
        fontWeight: ["600", "500"],
    };
}
function euroSign() {
    return {
        fontSize: "20px",
        position: "relative",
        top: "28px",
        left: "5px",
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
function inputContainerDropdown() {
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: ["100%", "180px"],
        marginTop: ["10px", 0],
    };
}
function formItemCheckBoxContainer() {
    return {
        width: "100%",
        display: "flex",
        marginBottom: "28px",
        alignItems: "center",
        justifyContent: "space-between",
    };
}
function formLabelCheckBox() {
    return {
        width: ["80%", "40%"],
        textAlign: "left",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Colors.PRIMARY,
    };
}
function inputContainerCheckbox() {
    return {
        width: ["10%", "50%"],
    };
}
function userInfo() {
    return {
        width: "50%",
        textAlign: "left",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Colors.PRIMARY,
        marginTop: ["5px", 0],
    };
}
function textField() {
    return {
        width: "180px",
        height: "32px",
        margin: "0 0 10px 0",
        padding: "8px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        border: "solid 1px #5c98d3",
        backgroundColor: "#ffffff",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
    };
}
function textArea() {
    return Object.assign(Object.assign({}, textField()), { width: "80%", height: "64px" });
}
function select() {
    return {
        maxWidth: "180px",
        height: "32px",
        margin: "0",
        padding: "4px 8px 4px 8px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        border: "solid 1px #5c98d3",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        appearance: "none",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        color: general_1.E_Colors.PRIMARY,
        borderRadius: 0,
    };
}
function singleValue() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
    };
}
function singleOption() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
    };
}
function menu() {
    return {
        width: "180px",
    };
}
function checkbox() {
    return {
        width: "32px",
        height: "32px",
        margin: "0",
        borderRadius: 0,
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        border: "solid 1px #a9d3e5",
        backgroundColor: "#ffffff",
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
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "400",
        color: "#0c445c",
        padding: "0 0 0 8px",
    };
}
function formError() {
    return {
        color: general_1.E_Colors.ERROR,
    };
}
function formBottomError() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: general_1.E_Colors.ERROR,
        width: "100%",
        textAlign: ["left", "center"],
    };
}
function bottomContainer() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginY: "10px",
    };
}
function link() {
    return {
        textDecoration: "underline",
        color: general_1.E_Colors.PRIMARY,
    };
}
function goBack() {
    return {
        margin: "30px 0 20px 0",
        textAlign: "center",
        width: "100%",
        fontWeight: "bold",
        cursor: "pointer",
    };
}
function contentHeading() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "18px",
        fontWeight: "bold",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
        margin: "0 15px 0 0",
    };
}
function contentText() {
    return {
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: general_1.E_Fonts.BASIC_FONT_SIZE,
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
        fontWeight: "normal",
        margin: "10px 0",
    };
}
//# sourceMappingURL=topupPage.styles.js.map