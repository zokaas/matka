import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts, E_Colors } from "../general";
import { getCommonLayoutRules } from "./layout.styles";

export function headerStyles(): SystemStyleObject {
    const commonRules: SystemStyleObject = getCommonLayoutRules();
    return {
        ...commonRules,
        width: ["100%", "940px"],
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: "row",
    };
}

export function headerContainer(): SystemStyleObject {
    const commonRules: SystemStyleObject = getCommonLayoutRules();
    return {
        ...commonRules,
        backgroundColor: "#fff",
        paddingTop: "23px",
        paddingBottom: "19px",
        paddingX: "20px",
    };
}

type MobileNavTextProps = {
    color: string;
};

export function mobileNavText(props: MobileNavTextProps): SystemStyleObject {
    return {
        color: props.color,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "13px",
    };
}
export function mobileNavMoreTitle(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontWeight: "bold",
        fontSize: "18px",
    };
}

export function mobileNavMoreClose(): SystemStyleObject {
    return {
        color: "#2d73b5",
        fontFamily: E_Fonts.FONT_FAMILY,
        fontWeight: "bold",
        fontSize: "20px",
        margin: 0,
    };
}
export function mobileNavMoreItemsHeading(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "18px",
        margin: "10px 0 0",
        fontWeight: "normal",
        fontStretch: "normal",
        lineHeight: "0.67",
        textAlign: "center",
    };
}
export function mobileNavMoreLink(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "18px",
        margin: "0 0 30px",
        fontWeight: "normal",
        fontStretch: "normal",
        lineHeight: "0.67",
        textAlign: "center",
    };
}

export function mobileNavMoreItemText(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: "18px",
        marginLeft: "16px",
        width: "200px",
        textAlign: "left",
    };
}
