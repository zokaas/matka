import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts } from "../general";

export function NoTopUpPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
export function NoTopUpPageTitleContainer(): SystemStyleObject {
    return {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
        padding: ["20px 0", "29px"],
        marginBottom: ["16px"],
    };
}
export function NoTopUpPageTitleText(): SystemStyleObject {
    return {
        fontSize: ["21px", "24px"],
        fontWeight: "bold",
    };
}
export function NoTopUpPageContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        width: "100%",
        backgroundColor: "white",
        padding: ["0", "20px"],
    };
}
export function NoTopUpPageText(): SystemStyleObject {
    return {
        marginLeft: " 8px",
        textAlign: "left",
    };
}

export function containerInfo(): SystemStyleObject {
    return {
        display: "flex",
        margin: ["10px", "5px"],
        alignItems: "center",
        justifyContent: "flex-start",
    };
}
export function containerInfoList(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        margin: "auto",
    };
}

export function NoTopUpPageLink(): SystemStyleObject {
    return {
        color: "#5c98d3",
        textAlign: "center",
    };
}
export function NoTopUpPageContactInfo(): SystemStyleObject {
    return {
        textAlign: "center",
        marginTop: "8px",
    };
}

export function NoTopUpPageContent(): SystemStyleObject {
    return {
        margin: ["10px 0", "20px 50px"],
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
    };
}
export function NoTopUpPageTitle(): SystemStyleObject {
    return {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "16px",
        padding: "11px",
        margin: ["0 35px", "0 10px"],
    };
}
