import { createTheme } from "@vanilla-extract/css";
// import backgroundImage from "./images/foretagslan_background.svg";
// Colors
const baseBlue100 = "oklch(0.9409 0.0126 255.51)"; //"#E6ECF4
const baseWhite100 = "oklch(100% 0 0)"; //"#ffffff"
const baseWhite200 = "oklch(98% 0 0)"; //"#f8f8f8"
const baseWhite300 = "oklch(95% 0 0)"; //"#eeeeee"
const baseContent = "oklch(21% 0.006 285.885)";
// Spacing
const basicSpacing = 0.25;
const basicPadding = `${basicSpacing * 6}`;
export const [themeClass, vars] = createTheme({
    color: {
        baseBlue100,
        baseWhite100,
        baseWhite200,
        baseWhite300,
        baseContent,
    },
    background: {
    // image: `url(${backgroundImage})`,
    },
    spacing: {
        basicPadding,
    },
    header: {
        backgroundColor: baseWhite100,
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        minHeight: "76px",
        position: "relative",
        width: "100%",
        zIndex: "10",
    },
});
