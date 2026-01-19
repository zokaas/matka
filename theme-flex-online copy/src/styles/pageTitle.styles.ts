import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts } from "../general";

export function titleBox(): SystemStyleObject {
    return {
        display: "flex",
        width: ["auto", "100%"],
        height: "100%",
        backgroundColor: "#ffffff",
        paddingY: ["20px", "29px"],
        marginBottom: ["20px", "16px"],
        marginX: ["16px", "0px"],
        justifyContent: "center",
        alignContent: "center",
    };
}

export function pageTitle(): SystemStyleObject {
    return {
        display: "flex",
        padding: 0,
        margin: 0,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: ["24px", "24px"],
        fontWeight: "bold",
        color: E_Fonts.BASIC_FONT_COLOR,
        textAlign: "center",
    };
}
