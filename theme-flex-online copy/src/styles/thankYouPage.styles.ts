import { SystemStyleObject } from "@styled-system/css";

export function thankYouPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
export function thankYouPageContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
    };
}

export function thankYouPageLink(): SystemStyleObject {
    return {
        color: "#5c98d3",
        display: "inline-block",
    };
}
export function thankYouPageContent(): SystemStyleObject {
    return {
        margin: ["15px 10px", "20px 200px 0 200px "],
        padding: ["0 0 20px 0", "0"],
        textAlign: "center",
    };
}

export function thankYouPagePhoneText(): SystemStyleObject {
    return {
        margin: ["0 10px 45px", "0 200px 33px"],
        textAlign: "center",
    };
}
export function thankYouPageTitle(): SystemStyleObject {
    return {
        textAlign: "center",
        fontWeight: "600",
        fontSize: "24px",
        paddingTop: ["11px", "40px"],
        margin: ["0 35px", "0 60px"],
    };
}
