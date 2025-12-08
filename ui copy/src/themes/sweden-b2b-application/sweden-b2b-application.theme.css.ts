import { createTheme } from "@vanilla-extract/css";
import { themeVars } from "../contract.css";
import background from "./assets/sweden-b2b-background.svg";
import logo from "./assets/sweden-b2b-logo.svg";

export const swedenB2BTheme = createTheme(themeVars, {
    /**
     * Base Colors - Sweden B2B specific
     */
    color: {
        baseBlue100: "oklch(0.9409 0.0126 255.51)", // #E6ECF4
        baseWhite100: "oklch(100% 0 0)", // #ffffff
        baseWhite200: "oklch(98% 0 0)", // #f8f8f8
        baseWhite400: "oklch(95% 0 0)", // #eeeeee
        baseContent: "oklch(21% 0.006 285.885)", // #373737
        activeContent: "oklch(13% 0.028 261.692)", // darker text

        baseGray100: "oklch(70.7% 0.022 261.325)",
        baseGray500: "oklch(55.1% 0.027 264.364)",
        baseNeutral350: "oklch(79.21% 0 0)", // #bbbbbb

        baseGreen400: "oklch(0.8526 0.1933 129.22)", // #a6e64b
        baseGreen410: "oklch(0.866 0.1973 129.33)", // #a9eb4c
        baseGreen420: "oklch(0.7792 0.1762 129.2)", // #93cc42
        baseGreen500: "oklch(0.6948 0.1262 151.95)", // #59b375

        blackAlpha50: "oklch(0 0 0 / 50%)",
        blackAlpha43: "oklch(0 0 0 / 43%)",
        blackAlpha20: "oklch(0 0 0 / 20%)",

        primary: "oklch(0.5299 0.1291 253.66)", // #2e6db4
        primaryContent: "oklch(100% 0 0)", // white
        success: "oklch(76% 0.177 163.223)",
        warning: "oklch(82% 0.189 84.429)",
        error: "oklch(0.5771 0.2152 27.33)",
    },

    /**
     * Typography - Sweden B2B font
     */
    font: {
        family: "'Open Sans', sans-serif",
    },
    background: {
        image: `url(${background})`,
        color: "transparent",
    },
    assets: {
        logo: `url(${logo})`,
    },
    header: {
        backgroundColor: "oklch(100% 0 0)", // white
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },

    steps: {
        badgeBackgroundColor: "oklch(0.6948 0.1262 151.95)", // baseGreen500
        badgeBorderColor: "oklch(0.6948 0.1262 151.95)", // baseGreen500
        labelColor: "oklch(70.7% 0.022 261.325)", // baseGray100
        labelActiveColor: "oklch(13% 0.028 261.692)", // activeContent
        progressLineBackgroundColor: "oklch(0.6948 0.1262 151.95)", // baseGreen500
    },
});
