"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonStyles = buttonStyles;
exports.buttonTextStyles = buttonTextStyles;
exports.greenButtonStyles = greenButtonStyles;
exports.grayButtonStyles = grayButtonStyles;
exports.buttonFontStyles = buttonFontStyles;
exports.disabledButtonStyles = disabledButtonStyles;
exports.whiteButtonStyles = whiteButtonStyles;
exports.whiteButtonLoanPageStyles = whiteButtonLoanPageStyles;
exports.whiteButtonFontStyles = whiteButtonFontStyles;
exports.backButtonStyles = backButtonStyles;
exports.backButtonFontStyles = backButtonFontStyles;
const general_1 = require("../general");
function buttonStyles() {
    return {
        height: "40px",
        margin: "0 0 0 24px",
        padding: "0 8px",
        border: "solid 1px #114786",
        backgroundColor: "#fff",
        fontSize: "14px",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontWeight: "normal",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: " 0.86",
        letterSpacing: "normal",
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
            borderColor: "#77BCF0",
            color: "#77BCF0",
            cursor: "pointer",
        },
    };
}
function buttonTextStyles() {
    return {
        display: ["none", "inline"],
    };
}
function greenButtonStyles(props) {
    var _a, _b, _c, _d;
    return {
        width: (_a = props === null || props === void 0 ? void 0 : props.width) !== null && _a !== void 0 ? _a : "271px",
        marginTop: (_b = props === null || props === void 0 ? void 0 : props.marginTop) !== null && _b !== void 0 ? _b : "35px",
        marginRight: (_c = props === null || props === void 0 ? void 0 : props.marginRight) !== null && _c !== void 0 ? _c : "10px",
        marginBottom: (_d = props === null || props === void 0 ? void 0 : props.marginBottom) !== null && _d !== void 0 ? _d : "0px",
        borderRadius: "5px",
        padding: "7px 0",
        border: "none",
        background: "linear-gradient(0deg, rgba(79,169,60,1) 0%, rgba(133,184,117,1.30) 50%, rgba(79,169,60,1) 100%)",
        ":hover": {
            background: "linear-gradient(0deg, rgba(141,199,126,1) 0%, rgba(174,222,138,1) 50%, rgba(141,199,126,1) 100%)",
            cursor: "pointer",
        },
        ":active": {
            background: "linear-gradient(0deg, rgba(109,185,104,1) 0%, rgba(142,209,119,1.35) 50%, rgba(109,185,104,1) 100%)",
            cursor: "pointer",
        },
        ":disabled": {
            background: "#b0b0b0",
            cursor: "none",
        },
    };
}
function grayButtonStyles(props) {
    var _a, _b;
    return Object.assign(Object.assign({}, greenButtonStyles(props)), { marginRight: (_a = props === null || props === void 0 ? void 0 : props.marginRight) !== null && _a !== void 0 ? _a : "0px", marginBottom: (_b = props === null || props === void 0 ? void 0 : props.marginBottom) !== null && _b !== void 0 ? _b : "0px", marginLeft: "5px", background: "linear-gradient(0deg,rgba(148,151,147) 0%,rgb(195 197 194) 50%,rgba(148,151,147,1) 100%)", ":hover": {
            background: "linear-gradient(0deg,rgba(140,141,139) 0%,rgb(175 180 174) 50%,rgba(140,141,139,1) 100%)",
            cursor: "pointer",
        } });
}
function buttonFontStyles() {
    return {
        fontSize: "14px",
        color: "white",
        fontWeight: "bold",
        letterSpacing: "normal",
    };
}
function disabledButtonStyles(props) {
    return {
        width: (props === null || props === void 0 ? void 0 : props.width) ? props.width : "271px",
        marginTop: (props === null || props === void 0 ? void 0 : props.marginTop) ? props.marginTop : "42px",
        borderRadius: "5px",
        padding: "7px 0",
        border: "none",
        backgroundColor: "#b0b0b0",
        fontSize: "14px",
        color: "#fff",
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        cursor: "not-allowed",
    };
}
function whiteButtonStyles(props) {
    return {
        width: (props === null || props === void 0 ? void 0 : props.width) ? props.width : "100%",
        height: (props === null || props === void 0 ? void 0 : props.height) ? props.height : "100%",
        color: general_1.E_Colors.PRIMARY,
        borderRadius: "6px",
        border: "solid 0.5px #cee1f3",
        boxShadow: "0px 3px 7px 1px rgba(29, 29, 27, 0.25)",
        background: "#fff",
        ":hover": {
            boxShadow: "0px 3px 7px 1px rgba(107, 197, 235, 0.64)",
            border: "solid 0.5px #5c98d3;",
            color: "#5c98d3",
            cursor: "pointer",
        },
        ":active": {
            backgroundColor: "#f6fafc",
            cursor: "pointer",
        },
        ":disabled": {
            background: "#fff",
            boxShadow: "0px 3px 9.6px 3.4px rgba(29, 29, 27, 0.25)",
        },
    };
}
function whiteButtonLoanPageStyles(props) {
    const styles = whiteButtonStyles({ width: "184px", height: "217px" });
    return Object.assign(Object.assign({}, styles), { borderRadius: "none" });
}
function whiteButtonFontStyles() {
    return {
        fontSize: "16px",
        padding: "5px",
    };
}
function backButtonStyles() {
    return {
        border: "solid 1px #cee1f3",
        backgroundColor: "#ffffff",
        borderRadius: "6px",
        height: "30px",
        width: "271px",
        marginTop: "30px",
        "&:nth-child(odd)": {
            marginRight: ["10px6px", "20px"],
        },
        ":hover": {
            border: "solid 1px #5c98d3",
            cursor: "pointer",
        },
    };
}
function backButtonFontStyles() {
    return {
        fontSize: "14px",
        color: "red",
        fontWeight: "bold",
        letterSpacing: "normal",
    };
}
//# sourceMappingURL=button.styles.js.map