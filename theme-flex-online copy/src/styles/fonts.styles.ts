import { SystemStyleObject } from "@styled-system/css";
import { E_Fonts, E_Colors } from "../general";

export function fontBoxTitle(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_TITLE_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        fontWeight: 600,
        padding: 0,
        margin: "31px 0 0 0",
        textAlign: "center",
    };
}

export function fontBoldedText(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        padding: 0,
        margin: "24px 0 0 0",
    };
}

export function fontBoldedTextSpan(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        padding: 0,
        margin: "0 10px 0 0",
    };
}
export function fontAmountHeading(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_TITLE_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
    };
}

export function fontContentText(alert: boolean = false): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        color: alert ? E_Colors.ERROR : E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
        fontWeight: "normal",
    };
}

export function fontFooterTitle(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        color: "#66aadf",
        fontWeight: "bold",
        margin: "0",
        padding: "0",
        marginBottom: ["24px"],
    };
}

export function fontFooterText(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.SMALLER_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        padding: 0,
        margin: "0 0 5px 0",
        fontWeight: "normal",
    };
}

export function fontUserPageTitle(): SystemStyleObject {
    return {
        textAlign: ["left", "center"],
        marginBottom: "20px",
        paddingTop: ["12px", "19px"],
    };
}

export function fontUserBoxTitle(): SystemStyleObject {
    const commonRules = fontBoldedText();
    return {
        ...commonRules,
        fontSize: "18px",
    };
}
