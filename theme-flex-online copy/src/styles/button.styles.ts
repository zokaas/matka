import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts, E_Colors } from "../general";

export function buttonStyles(): SystemStyleObject {
    return {
        height: "40px",
        margin: "0 0 0 24px",
        padding: "0 8px",
        border: "solid 1px #114786",
        backgroundColor: "#fff",
        fontSize: "14px",
        color: E_Fonts.BASIC_FONT_COLOR,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontWeight: "normal",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: " 0.86",
        letterSpacing: "normal",
        textAlign: "center",
        cursor: "pointer",

        "&:hover": {
            borderColor: "#77BCF0",
            color: "#77BCF0",
            cursor: "pointer",
        },
    };
}

export function buttonTextStyles(): SystemStyleObject {
    return {
        display: ["none", "inline"],
    };
}

type T_GreenButtonStyles = {
    width?: string | Array<string>;
    marginTop?: string | Array<string>;
    marginRight?: string | Array<string>;
    marginBottom?: string | Array<string>;
};

export function greenButtonStyles(props?: T_GreenButtonStyles): SystemStyleObject {
    return {
        width: props?.width ?? "271px",
        marginTop: props?.marginTop ?? "35px",
        marginRight: props?.marginRight ?? "10px",
        marginBottom: props?.marginBottom ?? "0px",
        borderRadius: "5px",
        padding: "7px 0",
        border: "none",
        background:
            "linear-gradient(0deg, rgba(79,169,60,1) 0%, rgba(133,184,117,1.30) 50%, rgba(79,169,60,1) 100%)",
        ":hover": {
            background:
                "linear-gradient(0deg, rgba(141,199,126,1) 0%, rgba(174,222,138,1) 50%, rgba(141,199,126,1) 100%)",
            cursor: "pointer",
        },
        ":active": {
            background:
                "linear-gradient(0deg, rgba(109,185,104,1) 0%, rgba(142,209,119,1.35) 50%, rgba(109,185,104,1) 100%)",
            cursor: "pointer",
        },
        ":disabled": {
            background: "#b0b0b0",
            cursor: "none",
        },
    };
}

export function grayButtonStyles(props?: T_GreenButtonStyles): SystemStyleObject {
    return {
        ...greenButtonStyles(props),
        marginRight: props?.marginRight ?? "0px",
        marginBottom: props?.marginBottom ?? "0px",
        marginLeft: "5px",
        background:
            "linear-gradient(0deg,rgba(148,151,147) 0%,rgb(195 197 194) 50%,rgba(148,151,147,1) 100%)",
        ":hover": {
            background:
                "linear-gradient(0deg,rgba(140,141,139) 0%,rgb(175 180 174) 50%,rgba(140,141,139,1) 100%)",
            cursor: "pointer",
        },
    };
}

export function buttonFontStyles(): SystemStyleObject {
    return {
        fontSize: "14px",
        color: "white",
        fontWeight: "bold",
        letterSpacing: "normal",
    };
}

export function disabledButtonStyles(props?: T_GreenButtonStyles): SystemStyleObject {
    return {
        width: props?.width ? props.width : "271px",
        marginTop: props?.marginTop ? props.marginTop : "42px",
        borderRadius: "5px",
        padding: "7px 0",
        border: "none",
        backgroundColor: "#b0b0b0",
        fontSize: "14px",
        color: "#fff",
        fontFamily: E_Fonts.FONT_FAMILY,
        cursor: "not-allowed",
    };
}

type T_WhiteButtonStyles = {
    width?: string | Array<string>;
    height?: string | Array<string>;
};
export function whiteButtonStyles(props?: T_WhiteButtonStyles) {
    return {
        width: props?.width ? props.width : "100%",
        height: props?.height ? props.height : "100%",
        color: E_Colors.PRIMARY,
        borderRadius: "6px",
        border: "solid 0.5px #cee1f3",
        boxShadow: "0px 3px 7px 1px rgba(29, 29, 27, 0.25)",
        background: "#fff",
        ":hover": {
            boxShadow: "0px 3px 7px 1px rgba(107, 197, 235, 0.64)",
            border: "solid 0.5px #5c98d3;",
            color: "#5c98d3",
            cursor: "pointer",
        },
        ":active": {
            backgroundColor: "#f6fafc",
            cursor: "pointer",
        },
        ":disabled": {
            background: "#fff",
            boxShadow: "0px 3px 9.6px 3.4px rgba(29, 29, 27, 0.25)",
        },
    };
}
export function whiteButtonLoanPageStyles(props?: T_WhiteButtonStyles): SystemStyleObject {
    const styles = whiteButtonStyles({ width: "184px", height: "217px" });
    return {
        ...styles,
        borderRadius: "none",
    };
}

export function whiteButtonFontStyles(): SystemStyleObject {
    return {
        fontSize: "16px",
        padding: "5px",
    };
}

// export function backButtonStyles(): SystemStyleObject {
//     return {
//         width: "271px",
//         height: "30px",
//         color: "red",
//         borderRadius: "6px",
//         border: "solid 0.5px #cee1f3",
//         marginTop: "30px",
//         background: "#fff",
//         cursor: "pointer",
//         ":hover": {
//             color: "#5c98d3",
//         },
//         ":active": {
//             backgroundColor: "#f6fafc",
//         },
//         ":disabled": {
//             background: "#fff",
//             boxShadow: "0px 3px 9.6px 3.4px rgba(29, 29, 27, 0.25)",
//         },
//     };
// }

export function backButtonStyles(): SystemStyleObject {
    return {
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        border: "solid 1px #cee1f3",
        backgroundColor: "#ffffff",
        borderRadius: "6px",
        height: "30px",
        width: "271px",
        marginTop: "30px",
        "&:nth-child(odd)": {
            marginRight: ["10px6px", "20px"],
        },
        ":hover": {
            border: "solid 1px #5c98d3",
            cursor: "pointer",
        },
    };
}

export function backButtonFontStyles(): SystemStyleObject {
    return {
        fontSize: "14px",
        color: "red",
        fontWeight: "bold",
        letterSpacing: "normal",
    };
}
