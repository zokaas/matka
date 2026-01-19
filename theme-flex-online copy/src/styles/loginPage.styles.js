"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPageRootStyles = loginPageRootStyles;
exports.contentContainer = contentContainer;
exports.heading = heading;
const general_1 = require("../general");
function loginPageRootStyles() {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    };
}
function contentContainer() {
    return {
        display: "flex",
        backgroundColor: "#fff",
        width: ["auto", "100%"],
        marginX: ["16px", "0px"],
        padding: "40px",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "40px",
    };
}
function heading() {
    return {
        fontSize: "24px",
        color: general_1.E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    };
}
//# sourceMappingURL=loginPage.styles.js.map