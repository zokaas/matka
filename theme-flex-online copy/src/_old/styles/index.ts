import { SystemStyleObject } from "@styled-system/css";
import { alignItems } from "styled-system";

export type BoxCssProps = {
    isCentered?: boolean;
    flexDirection?: "row" | "column";
};

export type TitleCssProps = {
    isTextCentered?: boolean;
};

export type LargeButtonCssProps = {
    isLogin?: boolean;
};

export function bodyTitle(props?: TitleCssProps): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: ["20px", "24px"],
        fontWeight: "bold",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: ["16px", "24px 0"],
        ...(props?.isTextCentered && { textAlign: "center" }),
    };
}

export function box(props?: BoxCssProps): SystemStyleObject {
    return {
        display: "flex",
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fdfdfd",
        backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)",
        ...(props?.isCentered && {
            justifyContent: "center",
            alignItems: "center",
        }),
        ...(props?.flexDirection && {
            flexDirection: props.flexDirection,
        }),
    };
}

export function contentBox(): SystemStyleObject {
    return {
        marginTop: ["16px", "30px"],
        marginBottom: ["40px", "80px"],
    };
}

export function headerContainer(): SystemStyleObject {
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: ["50px", "76px"],
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#f9f9f9",
    };
}

export function headerContent(): SystemStyleObject {
    return {
        maxWidth: "976px",
        width: "100%",
        height: "100%",
        padding: ["12px 0 12px 20px", "25px 25px 25px 40px"],
        display: "flex",
        flexDirection: "row",
    };
}

export function headerTitle(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "18px",
        fontWeight: "400",
        lineHeight: "1.3",
        color: "#0c445c",
        padding: "0 0 6px 40px",
    };
}

export function largeButton(props?: LargeButtonCssProps): SystemStyleObject {
    return {
        color: "#0c445c",
        borderRadius: "5px",
        backgroundColor: "#fff",
        fontFamily: "arial",
        border: "0",
        boxShadow: "0 2px 2px 0 rgba(12, 68, 92, 0.5)",
        cursor: "pointer",
        ...(props?.isLogin && { width: "212px", height: "172px" }),
        "&:hover": {
            boxShadow: "0 2px 2px 0 #2bace2",
        },
        "&:active": {
            backgroundColor: "#f6fafc",
            boxShadow: "0 2px 2px 0 #2bace2",
        },
        "&:disabled": {
            opacity: 0.5,
            boxShadow: "0 2px 2px 0 rgba(12, 68, 92, 0.5)",
            backgroundColor: "#fff",
            cursor: "default",
        },
    };
}

export function loginButtonTextStyle(): SystemStyleObject {
    return {
        textAlign: "center",
        fontFamily: "arial",
        fontSize: "16px",
        color: "#0c445c",
        fontWeight: "normal",
        margin: "0 0 16px 0",
        padding: "0",
        lineHeight: "1.5",
    };
}

export function pageTitle(props?: TitleCssProps): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: ["26px", "32px"],
        fontWeight: "bold",
        color: "#0c445c",
        padding: ["16px", "22px 0"],
        ...(props?.isTextCentered && { textAlign: "center" }),
    };
}

export function footerContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
    };
}
/**
 *
 *
 * Old, Fixza Application styles
 */
export function body(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 4px 0",
    };
}

export function userInfoContent(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 14px 0",
    };
}

export function userInfoTitle(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "bold",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: 0,
    };
}

export function textItem(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 14px 0",
        "::before": {
            content: `"\\2022"`,
            color: "#d297ca",
            marginRight: "8px",
        },
    };
}

export function secondaryButton(): SystemStyleObject {
    return {
        border: "none",
        padding: "8px 25px",
        borderRadius: "16px",
        backgroundColor: "#d297ca",
        opacity: "1",
        marginBottom: "16px",
        ":hover": {
            opacity: "0.75",
        },
        ":active": {
            opacity: 1,
            backgroundColor: "#b884b1",
        },
        ":disabled": {
            backgroundColor: "#d2c7d1",
        },
    };
}

export function secondaryButtonText(): SystemStyleObject {
    return {
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#ffffff",
        letterSpacing: "0.5px",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
        margin: 0,
        padding: 0,
    };
}

export function bodyLabel(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: "0 0 6px 0",
    };
}

export function bodyWarning(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#664a62",
        padding: "0 0 4px 0",
    };
}

export function mobilePageTitle(): SystemStyleObject {
    return {
        fontFamily: "'Baloo 2'",
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "2",
        color: "#71789b",
    };
}

export function textField(): SystemStyleObject {
    return {
        border: "0",
        borderRadius: "4px",
        boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        color: "#0c445c",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        width: "240px",
        height: "36px",
        padding: "6px 8px 6px 8px",
        margin: "0",
        "&::placeholder": {
            color: "#737373",
        },
    };
}

export function select(): SystemStyleObject {
    return {
        border: "0",
        borderRadius: "4px",
        boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        color: "#737373",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        width: "100%",
        height: "36px",
        padding: "0 8px 0 8px",
        margin: "0",
        cursor: "pointer",
        appearance: "none",
    };
}

export function checkbox(): SystemStyleObject {
    return {
        width: "24px",
        height: "24px",
        borderRadius: "4px",
        border: "solid 2px #979797",
        boxShadow: "2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset 0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    };
}

export function checkboxDisabled(): SystemStyleObject {
    return {
        width: "24px",
        height: "24px",
        borderRadius: "4px",
        border: "solid 2px #979797",
        boxShadow: "2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset 0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#d9d9d9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
}

export function checkboxText(): SystemStyleObject {
    return {
        fontFamily: "basic",
        fontSize: "16px",
        fontWeight: "400",
        color: "#0c445c",
        padding: "0 0 0 8px",
    };
}

export function button(): SystemStyleObject {
    return {
        border: "0px",
        borderRadius: "5px",
        backgroundColor: "transparent",
        backgroundImage: "linear-gradient(to top, #59b268, #afe681)",
        height: "34px",
        "&:hover": {
            backgroundImage:
                "linear-gradient(to top, rgba(89, 178, 104, 0.7), rgba(175, 230, 129, 0.7));",
        },
    };
}

export function buttonText(): SystemStyleObject {
    return {
        fontFamily: "basic",
        fontWeight: "bold",
        fontSize: "16px",
        color: "#fff",
        textTransform: "uppercase",
    };
}

export function formError(): SystemStyleObject {
    return {
        fontFamily: "basic",
        fontWeight: "bold",
        fontSize: "14px",
        color: "darkred",
        padding: "8px 0 0 0",
    };
}

export function link(): SystemStyleObject {
    return {
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "bold",
        lineHeight: "1.5",
        color: "#196da8",
        cursor: "pointer",
    };
}

export function headerLink(): SystemStyleObject {
    return {
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#196da8",
        cursor: "pointer",
        textDecoration: "underline",
    };
}

export function sideBox(): SystemStyleObject {
    return {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fdfdfd",
        backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)",
        padding: "32px 32px 32px 32px",
    };
}

export function breadcrumbBox(): SystemStyleObject {
    return {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fdfdfd",
        backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)",
        padding: ["12px", "32px"],
    };
}

export function inlineBox(): SystemStyleObject {
    return {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fdfdfd",
        backgroundImage: "linear-gradient(to bottom, #fdfdfd, #f9f9f9)",
        padding: "18px 16px 18px 16px",
        margin: "0 0 16px 0",
    };
}

export function sideTitle(): SystemStyleObject {
    return {
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily: "'Baloo 2', cursive",
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: "1.5",
        color: "#8f6789",
        padding: "0 0 16px 0",
    };
}

export function sideLink(): SystemStyleObject {
    return {
        color: "#8f6789",
        textDecoration: "none",
        "&:hover": {
            color: "#8f6789",
            textDecoration: "none",
        },
    };
}

export function breadcrumbTitle(): SystemStyleObject {
    return {
        display: "flex",
        fontFamily: "arial",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "1.5",
        color: "#0c445c",
        padding: ["0 10px 4px 0", "0 40px 0 0"],
        "&:first-of-type": {
            marginLeft: [0, "64px"],
        },
    };
}

export function buttonInfo(): SystemStyleObject {
    return {
        border: "0",
        borderRadius: "5px",
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#d8d8d8",
        color: "#5e5e5e",
        letterSpacing: "1.5",
        fontFamily: "arial",
        fontSize: "16px",
        padding: "8px 16px 8px 16px",
        margin: "0",
    };
}

export function buttonCancel(): SystemStyleObject {
    return {
        width: "150px",
        height: "40px",
        border: "0",
        borderRadius: "4px",
        boxShadow: "2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset 0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#fff",
        fontFamily: "arial",
        fontSize: "16px",
        color: "#cc0000",
    };
}

export function buttonSubmit(): SystemStyleObject {
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "240px",
        height: "64px",
        border: "0",
        borderRadius: "32px",
        backgroundColor: "#ade6c8",
        textShadow: "0 1px 2px rgba(0,0,0,0.30)",
        fontFamily: "arial",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#fff",
        margin: "0 0 32px 0",
        cursor: "pointer",
    };
}

export function buttonSubmitDisabled(): SystemStyleObject {
    return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "240px",
        height: "64px",
        border: "0",
        borderRadius: "32px",
        backgroundColor: "#CECECE",
        fontFamily: "arial",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#545454",
        margin: "0 0 32px 0",
        cursor: "not-allowed",
    };
}

export function buttonLogout(): SystemStyleObject {
    return {
        height: "38px",
        margin: "0",
        padding: "8px 11px",
        fontFamily: "arial",
        fontSize: "14px",
        letterSpacing: "-0.5px",
        color: "#085772",
        borderRadius: "5px",
        border: "solid 1px #085772",
        backgroundColor: "#fff",
        cursor: "pointer",
        "&:hover": {
            color: "#d297ca",
            border: "solid 1px #d297ca",
        },
    };
}

export function buttonLoginAgain(): SystemStyleObject {
    return {
        margin: "0",
        marginLeft: "8px",
        marginRight: ["8px", "0px"],
        fontFamily: "arial",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "#d297ca",
        textTransform: "uppercase",
        borderRadius: "5px",
        border: "0px",
        cursor: "pointer",
        height: "32px",
        padding: "0px 4px",
        "&:hover": {
            opacity: 0.75,
        },
        "&:active": {
            backgroundColor: "#b884b1",
        },
    };
}
