import { createTheme } from "@vanilla-extract/css";
import backgroundImage from "./images/foretagslan_background.svg";

// Colors
const baseBlue100 = "oklch(0.9409 0.0126 255.51)"; //"#E6ECF4
const baseWhite100 = "oklch(100% 0 0)"; //"#ffffff"
const baseWhite200 = "oklch(98% 0 0)"; //"#f8f8f8"
const baseWhite300 = "oklch(95% 0 0)"; //"#eeeeee"
const baseWhite400 = "oklch(92.49% 0 0)"; //#e6e6e6
const blackAlpha50 = "oklch(0 0 0 / 50%)"; //rgba(0, 0, 0, 0.5)
const blackAlpha43 = "oklch(0 0 0 / 43%)"; //rgba(0, 0, 0, 0.43)
const blackAlpha20 = "oklch(0 0 0 / 20%)"; //rgba(0, 0, 0, 0.2)
const baseContent = "oklch(21% 0.006 285.885)";
const activeContent = "oklch(13% 0.028 261.692)";

// baseGreen500 => Color used below is the closest to Tailwind's green color palette
// used from here: https://tailwindcss.com/docs/colors
const baseGreen400 = "oklch(0.8526 0.1933 129.22)"; // #a6e64b
const baseGreen410 = "oklch(0.866 0.1973 129.33)"; // #a9eb4c
const baseGreen420 = "oklch(0.7792 0.1762 129.2)"; // #93cc42
const baseGreen500 = "oklch(0.6948 0.1262 151.95)"; // #59b375
const stepsColor = baseGreen500;
const baseGray100 = "oklch(70.7% 0.022 261.325)";
const baseGray500 = "oklch(55.1% 0.027 264.364)";
const baseNeutral350 = "oklch(79.21% 0 0)"; // "#bbbbbb"

// Spacing
const basicSpacing = 0.25;
const defaultPadding = `${basicSpacing * 1}rem`;
const tinyPadding = `${basicSpacing * 2}rem`;
const smallPadding = `${basicSpacing * 4}rem`;
const basicPadding = `${basicSpacing * 6}rem`;
const largePadding = `${basicSpacing * 8}rem`;

// TODO: Should we use only size instead of spacing?
// Size
const basicSizeFactor = 0.5;
const size_xs = `${basicSizeFactor * 1}rem`; // approx. 8px
const size_s = `${basicSizeFactor * 2}rem`; // approx. 16px
const size_m = `${basicSizeFactor * 3}rem`; // approx. 24px
const size_l = `${basicSizeFactor * 4}rem`; // approx. 32px
const size_xl = `${basicSizeFactor * 5}rem`; // approx. 40px
const size_xxl = `${basicSizeFactor * 6}rem`; // approx. 48px
const size_xxxl = `${basicSizeFactor * 7}rem`; // approx. 56px
const size_huge = `${basicSizeFactor * 8}rem`; // approx. 64px

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
        baseWhite400,
        baseContent,
        blackAlpha50,
        blackAlpha43,
        blackAlpha20,
        activeContent,
        baseGray100,
        baseGray500,
        baseNeutral350,
        baseGreen400,
        baseGreen410,
        baseGreen420,
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
    size: {
        size_xs,
        size_s,
        size_m,
        size_l,
        size_xl,
        size_xxl,
        size_xxxl,
        size_huge,
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
