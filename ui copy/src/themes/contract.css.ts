import { createThemeContract } from "@vanilla-extract/css";

//TODO: go through theme and fiugure out how many colors themes really use
export const themeVars = createThemeContract({
    color: {
        // Base colors
        baseBlue100: null,
        baseWhite100: null,
        baseWhite200: null,
        baseWhite400: null,
        baseContent: null,
        activeContent: null,

        // Gray scale
        baseGray100: null,
        baseGray500: null,
        baseNeutral350: null,

        // Green scale
        baseGreen400: null,
        baseGreen410: null,
        baseGreen420: null,
        baseGreen500: null,

        // Alpha colors
        blackAlpha50: null,
        blackAlpha43: null,
        blackAlpha20: null,

        primary: null,
        primaryContent: null,
        success: null,
        warning: null,
        error: null,
    },
    font: {
        family: null,
    },
    background: {
        image: null,
        color: null,
    },
    assets: {
        logo: null,
    },

    //TODO: maybe these components don't need to be here, they should just use certain theme colors directly??
    header: {
        backgroundColor: null,
        boxShadow: null,
    },
    steps: {
        badgeBackgroundColor: null,
        badgeBorderColor: null,
        labelColor: null,
        labelActiveColor: null,
        progressLineBackgroundColor: null,
    },
});
