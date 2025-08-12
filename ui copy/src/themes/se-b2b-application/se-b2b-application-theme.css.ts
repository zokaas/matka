import { createTheme } from "@vanilla-extract/css";
import backgroundImage from "./images/foretagslan_background.svg";

// Colors
const baseBlue100 = "oklch(0.9409 0.0126 255.51)"; //"#E6ECF4
const baseWhite100 = "oklch(100% 0 0)"; //"#ffffff"
const baseWhite200 = "oklch(98% 0 0)"; //"#f8f8f8"
const baseWhite300 = "oklch(95% 0 0)"; //"#eeeeee"
const baseContent = "oklch(21% 0.006 285.885)";
const activeContent = "oklch(13% 0.028 261.692)";

// baseGreen500 => Color used below is the closest to Tailwind's green color palette
// used from here: https://tailwindcss.com/docs/colors
const baseGreen500 = "oklch(0.6948 0.1262 151.95)";
const stepsColor = baseGreen500;
const baseGray100 = "oklch(70.7% 0.022 261.325)";

// Spacing
const basicSpacing = 0.25;
const defaultPadding = `${basicSpacing * 1}rem`;
const tinyPadding = `${basicSpacing * 2}rem`;
const smallPadding = `${basicSpacing * 4}rem`;
const basicPadding = `${basicSpacing * 6}rem`;
const largePadding = `${basicSpacing * 8}rem`;

// Radius
const basicRadius = 0.25;
const radiusLg = `${basicRadius * 2}rem`;
const radiusMd = `${basicRadius}rem`;

// Container width
// TODO: Container (and width) const could be named differently !?
const container_2xl = "42rem";
const container_6xl = "72rem";
const container_lg = "32rem";
const container_md = "28rem";
const container_sm = "24rem";
const container_xl = "36rem";
const fullWidth = "100%";

// Fonts
// Copied directly from Tailwind
const baseTypographyValue = 1;

const baseBareSize = baseTypographyValue * 1;
const baseFontSize = `${baseBareSize}rem`;
const baseLineHeight = `${1.5 / baseBareSize}`;

const smBareSize = baseTypographyValue * 0.875;
const smFontSize = `${smBareSize}rem`;
const smLineHeight = `${1.25 / smBareSize}`;

const xsBareSize = baseTypographyValue * 1.125;
const xsFontSize = `${xsBareSize}rem`;
const xsLineHeight = `${1 / xsBareSize}`;

const lgBareSize = baseTypographyValue * 1.125;
const lgFontSize = `${lgBareSize}rem`;
const lgLineHeight = `${1.75 / lgBareSize}`;

const xlBareSize = baseTypographyValue * 1.25;
const xlFontSize = `${xlBareSize}rem`;
const xlLineHeight = `${1.75 / xlBareSize}`;

const xxlBareSize = baseTypographyValue * 1.5;
const xxlFontSize = `${xxlBareSize}rem`;
const xxlLineHeight = `${2 / xxlBareSize}`;

const xxxlBareSize = baseTypographyValue * 1.875;
const xxxlFontSize = `${xxxlBareSize}rem`;
const xxxlLineHeight = `${2.25 / xxxlBareSize}`;

const fontWeightNormal = "400";
const fontWeightMedium = "500";
const fontWeightSemiBold = "600";
const fontWeightBold = "700";

export const [themeClass, vars] = createTheme({
    color: {
        baseBlue100,
        baseWhite100,
        baseWhite200,
        baseWhite300,
        baseContent,
        activeContent,
        baseGray100,
        baseGreen500,
    },
    background: {
        image: `url(${backgroundImage})`,
    },
    font: {
        fontWeightBold,
        fontWeightMedium,
        fontWeightNormal,
        fontWeightSemiBold,
        size: {
            baseFontSize,
            lgFontSize,
            smFontSize,
            xlFontSize,
            xsFontSize,
            xxlFontSize,
            xxxlFontSize,
        },
        lineHeight: {
            baseLineHeight,
            lgLineHeight,
            smLineHeight,
            xlLineHeight,
            xsLineHeight,
            xxlLineHeight,
            xxxlLineHeight,
        },
    },
    radius: {
        radiusLg,
        radiusMd,
    },
    spacing: {
        basicPadding,
        smallPadding,
        largePadding,
        tinyPadding,
        defaultPadding,
    },
    width: {
        container_2xl,
        container_6xl,
        container_lg,
        container_md,
        container_sm,
        container_xl,
        fullWidth,
    },
    header: {
        backgroundColor: baseWhite100,
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        minHeight: "76px",
        position: "relative",
        width: "100%",
        zIndex: "10",
    },
    steps: {
        badge: {
            backgroudColor: stepsColor,
            borderColor: stepsColor,
        },
        label: {
            color: baseGray100,
            fontSize: smFontSize,
            marginTop: tinyPadding,
            activeColor: activeContent,
        },
        progressLine: {
            backgroundColor: stepsColor,
        },
    },
});
