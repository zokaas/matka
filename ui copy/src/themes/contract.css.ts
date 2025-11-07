import { createThemeContract } from "@vanilla-extract/css";

export const vars = createThemeContract({
    color: {
        baseBlue100: "",
        baseWhite100: "",
        baseWhite200: "",
        baseWhite300: "",
    },
    background: {
        image: "",
    },
    header: {
        backgroundColor: "",
        boxShadow: "",
        width: "",
        minHeight: "",
        zIndex: "",
        position: "",
    },
});
