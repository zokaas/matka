import { SystemStyleObject } from "@styled-system/css";
import { E_Colors, E_Fonts } from "..";
import { buttonFontStyles, greenButtonStyles } from "./button.styles";

type ModalContentProps = {
    height?: string[];
};

export function modalOverlay(): SystemStyleObject {
    return {
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        zIndex: 1500,
    };
}

export function modalTitle(): SystemStyleObject {
    return {
        color: E_Colors.PRIMARY,
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: 1.25,
        margin: ["22px 0 8px 0", "0 0 8px 0"],
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        fontFamily: E_Fonts.FONT_FAMILY,
    };
}
export function titleText(): SystemStyleObject {
    return {
        width: "100%",
        textAlign: "center",
    };
}

export function modalContent(): SystemStyleObject {
    return {
        position: ["absolute", "relative"],
        padding: ["6px 19px", "16px"],
        margin: ["0px auto", "106px auto"],
        height: ["auto", "object-fit"],
        backgroundColor: "#fdfeff",
        borderRadius: 0,
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
        width: ["100%", "664px"],
        left: [0, "auto"],
        right: [0, "auto"],
        top: ["86px", "auto"],
        bottom: ["56px", "auto"],
        color: "#0c445c",
        fontFamily: E_Fonts.FONT_FAMILY,
        overflowY: "auto",
    };
}

export function modalContentScroll(props?: ModalContentProps): SystemStyleObject {
    const commonRules = modalContent();
    return {
        ...commonRules,
        top: 0,
        bottom: 0,
        overflowY: "auto",
        padding: ["6px 9px", "25px"],
        height: props ? props?.height : "object-fit",
    };
}

export function modalButtonContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "space-around",
        alignItems: "center",
        margin: ["0 0 10px", "20px 20px"],
    };
}

type T_ModalButtonProps = {
    width?: string | Array<string>;
};

export function modalButtonStyles(props?: T_ModalButtonProps): SystemStyleObject {
    return {
        ...greenButtonStyles(props),
        display: "flex",
        textAlign: "center",
        width: props?.width ?? "100px",
        justifyContent: "center",
    };
}
export function modalCloseIcon(): SystemStyleObject {
    return {
        cursor: "pointer",
        marginLeft: "auto",
    };
}

export function modalButtonText(): SystemStyleObject {
    return {
        ...buttonFontStyles(),
        fontSize: E_Fonts.BASIC_FONT_SIZE,
    };
}
