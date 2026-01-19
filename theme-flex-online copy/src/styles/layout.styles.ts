import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts } from "../general";

export function getCommonLayoutRules(): SystemStyleObject {
    return {
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: ["column", "row"],
    };
}

export function rootGrid(): SystemStyleObject {
    return {
        marginBottom: "56px",
    };
}

export function fullWidthGrid(): SystemStyleObject {
    const commonRules: SystemStyleObject = getCommonLayoutRules();
    return {
        ...commonRules,
        marginBottom: ["20px", "38px"],
        maxWidth: "100%",
    };
}

export function mainContentGrid(): SystemStyleObject {
    const commonRules: SystemStyleObject = getCommonLayoutRules();
    return {
        ...commonRules,
        marginBottom: "56px",
        maxWidth: "960px",
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        lineHeight: E_Fonts.BASIC_LINE_HEIGHT,
    };
}
