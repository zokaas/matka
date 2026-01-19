import { SystemStyleObject } from "@styled-system/css";

import { E_Colors, E_Fonts } from "../general";

export function expiredPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
export function contentContainer(): SystemStyleObject {
    return {
        display: "flex",
        backgroundColor: "#fff",
        width: ["auto", "100%"],
        marginX: ["16px", "0px"],
        padding: "30px",
        flexDirection: "column",
        alignItems: "center",
    };
}

export function heading(): SystemStyleObject {
    return {
        fontSize: "24px",
        color: E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    };
}

export function content(): SystemStyleObject {
    return {
        fontSize: "18px",
        color: E_Fonts.BASIC_FONT_COLOR,
        lineHeight: "1.1",
        textAlign: "center",
    };
}

export function link(): SystemStyleObject {
    return {
        color: E_Colors.LINK,
    };
}
