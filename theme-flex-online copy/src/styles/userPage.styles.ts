import { SystemStyleObject } from "@styled-system/css";

import { E_Colors, E_Fonts } from "../general";

export function userPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}

export function userPageContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["auto", "100%"],
        backgroundColor: "#fff",
        padding: "2px 28px 34px 28px",
        marginBottom: ["20px", "16px"],
    };
}

export function userPageFlexContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
    };
}

export function userPageColumn(): SystemStyleObject {
    return {
        width: ["100%", "50%"],
    };
}

export function userPageTextGroup(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
    };
}

export function userPageTextButtonGroup(): SystemStyleObject {
    return {
        width: "250px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    };
}

export function userPageButtonGroup(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 0,
        padding: 0,
    };
}

export function userPageAddressColumn(): SystemStyleObject {
    return {
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
    };
}

export function formError(): SystemStyleObject {
    return {
        color: E_Colors.ERROR,
    };
}

export function inputContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: ["100%", "50%"],
        marginTop: ["10px", 0],
    };
}

export function textField(): SystemStyleObject {
    return {
        width: "250px",
        height: "32px",
        margin: "10px 0 10px 0",
        padding: "8px",
        boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
        border: "solid 1px #5c98d3",
        backgroundColor: "#ffffff",
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        color: E_Fonts.BASIC_FONT_COLOR,
    };
}

export function titleAndEditButtonContainer(): SystemStyleObject {
    return {
        width: ["auto", "100%"],
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };
}
