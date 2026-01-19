import { SystemStyleObject } from "@styled-system/css";
import { E_Colors, E_Fonts } from "..";

export function accountListPageRootStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };
}
export function accountListContainerStyles(): SystemStyleObject {
    return {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: ["0", "30px 0 50px 0"],
        backgroundColor: ["none", "white"],
        textAlign: "center",
    };
}
export function accountStyle(): SystemStyleObject {
    return {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
    };
}

export function accountListButtonContainer(): SystemStyleObject {
    return {
        display: "flex",
        width: ["290px", "330px"],
        height: "93px",
        margin: "10px",
    };
}
