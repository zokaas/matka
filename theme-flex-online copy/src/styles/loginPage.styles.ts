import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts } from "../general";

export function loginPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    };
}
export function contentContainer(): SystemStyleObject {
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
export function heading(): SystemStyleObject {
    return {
        fontSize: "24px",
        color: E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    };
}
