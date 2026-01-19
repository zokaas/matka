import { SystemStyleObject } from "@styled-system/css";
import { E_Fonts } from "../general";

const txtNormal = {
    fontFamily: E_Fonts.FONT_FAMILY,
    color: E_Fonts.BASIC_FONT_COLOR,
    fontWeight: "normal",
    margin: "0",
    padding: "0",
    lineHeight: "1.5",
    fontSize: E_Fonts.BASIC_FONT_SIZE,
};

export function footer(): SystemStyleObject {
    return {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "white",
        py: ["40px", "48px"],
        pl: ["0", "0", "150px"],
        width: "100%",
    };
}

export function footerColumn(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        ml: ["30px", "30px", "0"],
    };
}

export function footerRow(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        color: E_Fonts.BASIC_FONT_COLOR,
        fontSize: E_Fonts.SMALLER_FONT_SIZE,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: "12px",
    };
}
export function footerIconWrapper(): SystemStyleObject {
    return {
        ...txtNormal,
        marginRight: "14px",
        minWidth: "24px",
        alignItems: "center",
        display: "inline-flex",
        fontSize: "10px",
    };
}

export function footerLink(): SystemStyleObject {
    return {
        ...txtNormal,
        fontSize: E_Fonts.SMALLER_FONT_SIZE,
    };
}
