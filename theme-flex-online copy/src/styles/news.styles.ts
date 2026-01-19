import { SystemStyleObject } from "@styled-system/css";
import { E_Colors, E_Fonts } from "../general";

export function heading(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "24px",
        textAlign: "center",
        fontWeight: 600,
    };
}

export function newsWrapper(): SystemStyleObject {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        margin: "20px 0 10px 0",
    };
}

export function headlines({ textAlign }): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        textAlign: ["left", textAlign],
        margin: "10px 0",
    };
}

export function newsDate({ textAlign }): SystemStyleObject {
    return {
        color: E_Colors.NEWS_DATE,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "12px",
        textAlign: ["left", textAlign],
        marginBottom: "10px",
    };
}

export function news({ textAlign }): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "12px",
        textAlign: ["left", textAlign],
        margin: "10px 0",
    };
}
export function seeMore(): SystemStyleObject {
    return {
        color: E_Colors.LINK,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "12px",
        textAlign: "left",
    };
}
