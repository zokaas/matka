import { SystemStyleObject } from "@styled-system/css";

export function mobileNavItemsWrapper(): SystemStyleObject {
    return {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        justifyContent: "space-between",
        padding: "10px 10px 10px 65px",
    };
}
