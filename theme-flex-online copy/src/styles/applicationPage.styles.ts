import { SystemStyleObject } from "@styled-system/css";
import { marginBottom } from "styled-system";

import { E_Fonts, E_Colors } from "../general";

export function pageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: 0,
        margin: 0,
    };
}

//Form Styles---------------------------------------------------

export function formSection(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: ["100%", "64%"],
        backgroundColor: "#fff",
        padding: 0,
        margin: 0,
    };
}

export function formHeading(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        color: E_Colors.PRIMARY,
    };
}

//TrustPilot Styles-----------------------------------------
export function trustPilotSection(): SystemStyleObject {
    return {
        display: ["none", "flex"],
        flexDirection: "column",
        width: "35%",
        backgroundColor: "rgb(3, 103, 166)",
        padding: "15px",
    };
}

export function tpHeading(): SystemStyleObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        color: "#fff",
    };
}

// export function applicationContainer(): SystemStyleObject {
//     return {
//         display: "flex",
//         flexDirection: "column",
//         width: ["auto", "100%"],
//         backgroundColor: "#fff",
//         padding: "22px 28px",
//     };
// }

// export function formTitle(): SystemStyleObject {
//     return {
//         fontSize: "24px",
//         textAlign: ["center", "left"],
//         fontWeight: "600",
//         marginBottom: "18px",
//         lineHeight: 1.1,
//         fontFamily: E_Fonts.FONT_FAMILY,
//         color: E_Colors.PRIMARY,
//     };
// }

// export function formDescription(): SystemStyleObject {
//     return {
//         textAlign: "left",
//         fontFamily: E_Fonts.FONT_FAMILY,
//         color: E_Colors.PRIMARY,
//         marginBottom: "20px",
//     };
// }

// export function sectionTitle(): SystemStyleObject {
//     return {
//         textAlign: "left",
//         fontFamily: E_Fonts.FONT_FAMILY,
//         color: E_Colors.PRIMARY,
//         fontSize: "16px",
//         fontWeight: "bold",
//         marginBottom: "30px",
//     };
// }
// export function formItemContainer(): SystemStyleObject {
//     return {
//         width: "100%",
//         display: "flex",
//         flexDirection: ["column", "row"],
//         marginBottom: "28px",
//         alignItems: ["flex-start", "center"],
//         justifyContent: "space-between",
//     };
// }
// export function formLabel(): SystemStyleObject {
//     return {
//         width: ["100%", "40%"],
//         textAlign: "left",
//         fontFamily: E_Fonts.FONT_FAMILY,
//         color: E_Colors.PRIMARY,
//         fontWeight: ["600", "500"],
//     };
// }
// export function inputContainer(): SystemStyleObject {
//     return {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         width: ["100%", "50%"],
//         marginTop: ["10px", 0],
//     };
// }
// export function inputContainerDropdown(): SystemStyleObject {
//     return {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         width: ["100%", "180px"],
//         marginTop: ["10px", 0],
//     };
// }

// export function formItemCheckBoxContainer(): SystemStyleObject {
//     return {
//         width: "100%",
//         display: "flex",
//         marginBottom: "28px",
//         alignItems: "center",
//         justifyContent: "space-between",
//     };
// }

// export function formLabelCheckBox(): SystemStyleObject {
//     return {
//         width: ["80%", "40%"],
//         textAlign: "left",
//         fontFamily: E_Fonts.FONT_FAMILY,
//         color: E_Colors.PRIMARY,
//     };
// }

// export function inputContainerCheckbox(): SystemStyleObject {
//     return {
//         width: ["10%", "50%"],
//     };
// }

// export function userInfo(): SystemStyleObject {
//     return {
//         width: "50%",
//         textAlign: "left",
//         fontFamily: E_Fonts.FONT_FAMILY,
//         color: E_Colors.PRIMARY,
//         marginTop: ["5px", 0],
//     };
// }

// export function textField(): SystemStyleObject {
//     return {
//         width: "180px",
//         height: "32px",
//         margin: "0 0 10px 0",
//         padding: "8px",
//         boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
//         border: "solid 1px #5c98d3",
//         backgroundColor: "#ffffff",
//         fontFamily: E_Fonts.FONT_FAMILY,
//         fontSize: "16px",
//         color: E_Fonts.BASIC_FONT_COLOR,
//     };
// }

// export function select(): SystemStyleObject {
//     return {
//         maxWidth: "180px",
//         height: "32px",
//         margin: "0",
//         padding: "4px 8px 4px 8px",
//         boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
//         border: "solid 1px #5c98d3",
//         backgroundColor: "#ffffff",
//         cursor: "pointer",
//         appearance: "none",
//         fontFamily: E_Fonts.FONT_FAMILY,
//         fontSize: "16px",
//         color: E_Colors.PRIMARY,
//         borderRadius: 0,
//     };
// }

// export function singleValue(): SystemStyleObject {
//     return {
//         fontFamily: E_Fonts.FONT_FAMILY,
//         color: E_Fonts.BASIC_FONT_COLOR,
//         fontSize: E_Fonts.BASIC_FONT_SIZE,
//     };
// }

// export function singleOption(): SystemStyleObject {
//     return {
//         fontFamily: E_Fonts.FONT_FAMILY,
//     };
// }

// export function menu(): SystemStyleObject {
//     return {
//         width: "180px",
//     };
// }

// export function checkbox(): SystemStyleObject {
//     return {
//         width: "32px",
//         height: "32px",
//         margin: "0",
//         borderRadius: 0,
//         boxShadow: "0px 3px 7.4px 2.6px rgba(29, 29, 27, 0.25)",
//         border: "solid 1px #a9d3e5",
//         backgroundColor: "#ffffff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: "pointer",
//     };
// }

// export function checkboxDisabled(): SystemStyleObject {
//     return {
//         width: "24px",
//         height: "24px",
//         borderRadius: "4px",
//         border: "solid 2px #979797",
//         boxShadow: "2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset 0 1px 4px 0 rgba(0, 0, 0, 0.3)",
//         backgroundColor: "#d9d9d9",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//     };
// }

// export function checkboxText(): SystemStyleObject {
//     return {
//         fontFamily: "arial",
//         fontSize: "16px",
//         fontWeight: "400",
//         color: "#0c445c",
//         padding: "0 0 0 8px",
//     };
// }

// export function formError(): SystemStyleObject {
//     return {
//         color: E_Colors.ERROR,
//     };
// }

// export function formBottomError(): SystemStyleObject {
//     return {
//         fontFamily: E_Fonts.FONT_FAMILY,
//         fontSize: E_Fonts.BASIC_FONT_SIZE,
//         color: E_Colors.ERROR,
//         width: "100%",
//         textAlign: ["left", "center"],
//     };
// }

// export function bottomContainer(): SystemStyleObject {
//     return {
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         marginY: "10px",
//     };
// }

// export function link(): SystemStyleObject {
//     return {
//         textDecoration: "underline",
//         color: E_Colors.PRIMARY,
//     };
// }

// export function goBack(): SystemStyleObject {
//     return {
//         margin: "30px 0 20px 0",
//         textAlign: "center",
//         width: "100%",
//         fontWeight: "bold",
//         // textDecoration: "underline",
//         cursor: "pointer",
//     };
// }

// export function contentText(): SystemStyleObject {
//     return {
//         fontFamily: E_Fonts.FONT_FAMILY,
//         fontSize: E_Fonts.BASIC_FONT_SIZE,
//         color: E_Fonts.BASIC_FONT_COLOR,
//         padding: 0,
//         fontWeight: "normal",
//         textAlign: "center",
//         margin: "10px 0",
//     };
// }
