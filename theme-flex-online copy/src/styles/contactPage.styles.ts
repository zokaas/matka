import { SystemStyleObject } from "@styled-system/css";
import { E_Fonts } from "..";

export function contactPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
export function contactPageInfoContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        marginX: ["16px", "0px"],
        lineHeight: E_Fonts.BASIC_LINE_HEIGHT,
    };
}
export function contactPageTextWrapper(): SystemStyleObject {
    return {
        margin: "2px 0",
    };
}

export function contactPageInfoBox(): SystemStyleObject {
    return {
        width: ["100%", "472px"],
        height: "100%",
        padding: ["0 24px 24px 24px"],
        backgroundColor: "#fff",
        textAlign: ["left", "center"],
        "&:first-child": {
            marginRight: ["0", "16px"],
            marginBottom: ["16px", "0"],
        },
    };
}

export function contactPageLinkFaq(): SystemStyleObject {
    return {
        color: "#5c98d3",
        marginTop: "6px",
        display: "inline-block",
    };
}
export function contactPageLink(): SystemStyleObject {
    return {
        color: "#5c98d3",
        display: "inline-block",
    };
}
export function contactPageLinkEmail(): SystemStyleObject {
    return {
        color: "#5c98d3",
        textDecoration: "none",
    };
}
