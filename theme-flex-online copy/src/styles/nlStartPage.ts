import { SystemStyleObject } from "@styled-system/css";
import { E_Colors } from "..";
import { E_Fonts, T_StartPageBankProperties } from "../general";
type PageNoticeProps = {
    label: string;
};
export function startPageNotice(): SystemStyleObject {
    return {
        display: "flex",
        padding: 0,
        margin: 0,
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.SMALLER_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        textAlign: "left",
    };
}
export function startPageNoticeContainer(props: PageNoticeProps): SystemStyleObject {
    const backgroundColor =
        props.label === "Alert"
            ? `rgba(245,212,29, 0.04)`
            : props.label === "Critical"
            ? `rgba(255,0,0,0.04)`
            : `rgba(18,72,0144,0.04)`;
    const border =
        props.label === "Alert"
            ? `1px solid ${E_Colors.WARNING}`
            : props.label === "Critical"
            ? `1px solid ${E_Colors.ERROR}`
            : `1px solid ${E_Fonts.BASIC_FONT_COLOR}`;
    return {
        display: "flex",
        width: ["auto", "100%"],
        height: "100%",
        background: "#ffffff",
        backgroundColor: backgroundColor,
        padding: ["10px 20px", "10px 22px"],
        marginBottom: ["20px", "16px"],
        marginX: ["16px", "0px"],
        justifyContent: "center",
        alignContent: "center",
        border: border,
    };
}
export function startPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}

export function startPageNoticeListContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
    };
}

export function startPageContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: ["column", "row"],
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: ["30px 0px", "50px"],
    };
}

export function bankIdContainer(): SystemStyleObject {
    return {
        display: "flex",
        justifyContent: "center",
    };
}

export function startPageContentStyles(): SystemStyleObject {
    return {
        display: "flex",
        width: ["100%", "680px"],
        alignSelf: "center",
        flexWrap: "wrap",
        paddingX: ["16px", "0px"],
    };
}

export function startPagePathDivider(): SystemStyleObject {
    return {
        display: ["none", "inline"],
        width: "1.5px",
        backgroundColor: "#ABABAB",
        color: "grey",
        height: "100%",
    };
}

export function startPagePathDividerText(): SystemStyleObject {
    return {
        textAlign: "center",
        display: ["inline", "none"],
        padding: 0,
        marginY: ["50px", "30px"],
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: ["18px", "18px"],
        color: E_Fonts.BASIC_FONT_COLOR,
    };
}
export function startPageApplicationPath(): SystemStyleObject {
    return {
        width: ["100%", "49%"],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };
}
export function startPagePathHeading(): SystemStyleObject {
    return {
        display: "flex",
        padding: 0,
        margin: ["0 0 20px 0", "0 0 40px 0"],
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: ["20px", "20px"],
        fontWeight: "bold",
        color: E_Fonts.BASIC_FONT_COLOR,
        textAlign: "center",
    };
}
export function startPageLoginPath(): SystemStyleObject {
    return {
        width: ["100%", "49%"],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };
}
export function startPageApplyForLoan(): SystemStyleObject {
    return {
        display: "flex",
        fontSize: E_Fonts.SMALLEST_FONT_SIZE,
        padding: 0,
        marginBottom: "10px",
        fontFamily: E_Fonts.FONT_FAMILY,
        color: E_Fonts.BASIC_FONT_COLOR,
        textAlign: "center",
        whiteSpace: "nowrap",
    };
}
export function startPageApplyForLoanLink(): SystemStyleObject {
    return {
        ...startPageApplyForLoan(),
        textDecoration: "underline",
        cursor: "pointer",
        ":hover": {
            color: "#0056b3",
        },
        marginLeft: "2px",
    };
}
