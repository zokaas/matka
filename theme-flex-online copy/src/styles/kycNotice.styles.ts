import { SystemStyleObject } from "@styled-system/css";
import { E_Fonts, E_Colors } from "../general";

export function kycNotice(): SystemStyleObject {
    return {
        display: "flex",
        padding: 0,
        margin: 0,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.SMALLER_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        textAlign: "left",
        whiteSpace: "pre-wrap",
    };
}

export function kycNoticeContainer(): SystemStyleObject {
     console.log('E_Colors.ERROR value:', E_Colors.ERROR); 
    return {
        display: "flex",
        width: ["auto", "100%"],
        background: "#ffffff",
        backgroundColor: "rgba(255,0,0,0.04)",
        padding: ["10px 20px", "10px 22px"],
        marginBottom: ["20px", "16px"],
        marginX: ["16px", "0px"],
        justifyContent: "center",
        alignContent: "center",
        border: `1px solid ${E_Colors.ERROR} !important`, // Force it
        borderColor: `${E_Colors.ERROR} !important`,
    };
}