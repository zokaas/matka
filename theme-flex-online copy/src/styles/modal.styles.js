"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalOverlay = modalOverlay;
exports.modalTitle = modalTitle;
exports.titleText = titleText;
exports.modalContent = modalContent;
exports.modalContentScroll = modalContentScroll;
exports.modalButtonContainer = modalButtonContainer;
exports.modalButtonStyles = modalButtonStyles;
exports.modalCloseIcon = modalCloseIcon;
exports.modalButtonText = modalButtonText;
const __1 = require("..");
const button_styles_1 = require("./button.styles");
function modalOverlay() {
    return {
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        zIndex: 1500,
    };
}
function modalTitle() {
    return {
        color: __1.E_Colors.PRIMARY,
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: 1.25,
        margin: ["22px 0 8px 0", "0 0 8px 0"],
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        fontFamily: __1.E_Fonts.FONT_FAMILY,
    };
}
function titleText() {
    return {
        width: "100%",
        textAlign: "center",
    };
}
function modalContent() {
    return {
        position: ["absolute", "relative"],
        padding: ["6px 19px", "16px"],
        margin: ["0px auto", "106px auto"],
        height: ["auto", "object-fit"],
        backgroundColor: "#fdfeff",
        borderRadius: 0,
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        width: ["100%", "664px"],
        left: [0, "auto"],
        right: [0, "auto"],
        top: ["86px", "auto"],
        bottom: ["56px", "auto"],
        color: "#0c445c",
        fontFamily: __1.E_Fonts.FONT_FAMILY,
        overflowY: "auto",
    };
}
function modalContentScroll(props) {
    const commonRules = modalContent();
    return Object.assign(Object.assign({}, commonRules), { top: 0, bottom: 0, overflowY: "auto", padding: ["6px 9px", "25px"], height: props ? props === null || props === void 0 ? void 0 : props.height : "object-fit" });
}
function modalButtonContainer() {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "space-around",
        alignItems: "center",
        margin: ["0 0 10px", "20px 20px"],
    };
}
function modalButtonStyles(props) {
    var _a;
    return Object.assign(Object.assign({}, (0, button_styles_1.greenButtonStyles)(props)), { display: "flex", textAlign: "center", width: (_a = props === null || props === void 0 ? void 0 : props.width) !== null && _a !== void 0 ? _a : "100px", justifyContent: "center" });
}
function modalCloseIcon() {
    return {
        cursor: "pointer",
        marginLeft: "auto",
    };
}
function modalButtonText() {
    return Object.assign(Object.assign({}, (0, button_styles_1.buttonFontStyles)()), { fontSize: __1.E_Fonts.BASIC_FONT_SIZE });
}
//# sourceMappingURL=modal.styles.js.map