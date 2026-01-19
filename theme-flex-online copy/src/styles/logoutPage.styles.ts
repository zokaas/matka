import { SystemStyleObject } from "@styled-system/css";
import { E_Colors } from "..";

import { E_Fonts } from "../general";

export function logoutPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}

export function pageContent(): SystemStyleObject {
    return {
        paddingX: "40px",
        width: ["auto", "100%"],
        marginX: ["16px", "0px"],
        backgroundColor: "#fff",
    };
}

export function content(): SystemStyleObject {
    return {
        width: "100%",
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        textAlign: "center",
        lineHeight: 1.5,
    };
}

export function link(): SystemStyleObject {
    return {
        color: E_Colors.LINK,
        textDecoration: "underline",
    };
}
