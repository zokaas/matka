import { SystemStyleObject } from "@styled-system/css";

import { E_Fonts } from "../general";

export function noLoanPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
export function noLoanPageContainer(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "white",
    };
}

export function NoLoanPageLink(): SystemStyleObject {
    return {
        color: "#5c98d3",
        display: "inline-block",
    };
}
export function NoLoanPageContent(): SystemStyleObject {
    return {
        margin: ["15px 10px", "20px 200px 33px 200px "],
        padding: ["0 0 45px 0", "0"],
        textAlign: "center",
    };
}
export function NoLoanPageTitle(): SystemStyleObject {
    return {
        textAlign: "center",
        fontWeight: "600",
        fontSize: "24px",
        paddingTop: ["11px", "40px"],
        margin: ["0 35px", "0 60px"],
    };
}
