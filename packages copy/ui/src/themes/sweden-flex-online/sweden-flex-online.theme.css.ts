import { createTheme } from "@vanilla-extract/css";
import { themeVars } from "../contract.css";
import logo from "./assets/sweden-flex-online-logo.svg";

export const swedenFlexOnlineTheme = createTheme(themeVars, {

    color: {
        baseBlue100: "oklch(0.9862 0.0048 240.91)", // #f6fafc - light blue/footer
        baseWhite100: "oklch(100% 0 0)", // #ffffff
        baseWhite200: "oklch(0.9984 0.0007 240.91)", // #fdfeff
        baseWhite400: "oklch(95% 0 0)", // #eeeeee
        baseContent: "oklch(0.2981 0.0489 239.15)", // #0c445c - dark blue text
        activeContent: "oklch(0.2981 0.0489 239.15)", // #0c445c - dark blue text

        baseGray100: "oklch(0.7404 0.1161 229.79)", // #2bace2 - bright blue
        baseGray500: "oklch(0.5929 0.0688 233.85)", // #5593a8
        baseNeutral350: "oklch(0.7782 0.0087 241.08)", // #b7c3c7

        baseGreen400: "oklch(0.7288 0.1265 123.78)", // #94b93a - primary green
        baseGreen410: "oklch(0.7288 0.1265 123.78)", // #94b93a
        baseGreen420: "oklch(0.7288 0.1265 123.78)", // #94b93a
        baseGreen500: "oklch(0.7288 0.1265 123.78)", // #94b93a

        blackAlpha50: "oklch(0 0 0 / 50%)",
        blackAlpha43: "oklch(0 0 0 / 43%)",
        blackAlpha20: "oklch(0 0 0 / 20%)",

        primary: "oklch(0.2981 0.0489 239.15)", // #0c445c - dark blue
        primaryContent: "oklch(100% 0 0)", // white
        success: "oklch(0.7288 0.1265 123.78)", // #94b93a - green
        warning: "oklch(0.7461 0.1576 68.04)", // #e25210 - orange
        error: "oklch(0.3585 0.1395 29.23)", // darkred

        footerTextColor: "oklch(0.2981 0.0489 239.15)", // #0c445c - dark blue text
    },

    /**
     * Typography - Flex font
     */
    font: {
        family: "'Open Sans', sans-serif",
    },
    background: {
        image: "none",
        color: "oklch(100% 0 0)", // white
    },
    assets: {
        logo: `url(${logo})`,
    },
    header: {
        backgroundColor: "oklch(100% 0 0)", // white
        boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.2)",
    },

    steps: {
        badgeBackgroundColor: "oklch(0.7288 0.1265 123.78)", // #94b93a - green
        badgeBorderColor: "oklch(0.7288 0.1265 123.78)", // #94b93a - green
        labelColor: "oklch(0.7404 0.1161 229.79)", // #2bace2 - bright blue
        labelActiveColor: "oklch(0.2981 0.0489 239.15)", // #0c445c - dark blue
        progressLineBackgroundColor: "oklch(0.7288 0.1265 123.78)", // #94b93a - green
    },
});