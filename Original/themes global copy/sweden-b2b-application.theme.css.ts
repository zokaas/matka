// packages/ui/src/themes/sweden-b2b-application.theme.css.ts
import { createTheme } from "@vanilla-extract/css";
import { themeVars } from "./contract.css";
import backgroundImage from "../assets/backgrounds/Foretagslan_background.svg";

/**
 * Sweden B2B Theme
 * Only contains values that are SPECIFIC to this theme
 * Constants are imported from constants.ts and used directly in components
 */
export const swedenB2BTheme = createTheme(themeVars, {
    /**
     * Brand Colors - Sweden B2B specific
     */
    color: {
        // Primary brand colors
        primary: "oklch(58.5% 0.233 277.117)",
        primaryContent: "oklch(100% 0 0)",
        secondary: "oklch(70% 0.15 130)",
        secondaryContent: "oklch(94% 0.028 342.258)",
        accent: "oklch(77% 0.152 181.912)",
        accentContent: "oklch(38% 0.063 188.416)",

        // Base colors
        baseWhite100: "oklch(100% 0 0)",
        baseWhite200: "oklch(98% 0 0)",
        baseWhite300: "oklch(95% 0 0)",
        baseWhite400: "oklch(92.49% 0 0)",
        baseContent: "oklch(21% 0.006 285.885)",
        activeContent: "oklch(13% 0.028 261.692)",

        // Semantic colors
        success: "oklch(76% 0.177 163.223)",
        successContent: "oklch(37% 0.077 168.94)",
        warning: "oklch(82% 0.189 84.429)",
        warningContent: "oklch(41% 0.112 45.904)",
        error: "oklch(71% 0.194 13.428)",
        errorContent: "oklch(27% 0.105 12.094)",
        info: "oklch(74% 0.16 232.661)",
        infoContent: "oklch(29% 0.066 243.157)",

        // Component-specific colors
        baseGray100: "oklch(70.7% 0.022 261.325)",
        baseGray500: "oklch(55.1% 0.027 264.364)",
        baseNeutral350: "oklch(79.21% 0 0)",
        baseGreen400: "oklch(0.8526 0.1933 129.22)",
        baseGreen410: "oklch(0.866 0.1973 129.33)",
        baseGreen420: "oklch(0.7792 0.1762 129.2)",
        baseGreen500: "oklch(0.6948 0.1262 151.95)",

        // Alpha colors
        blackAlpha50: "oklch(0 0 0 / 50%)",
        blackAlpha43: "oklch(0 0 0 / 43%)",
        blackAlpha20: "oklch(0 0 0 / 20%)",
    },

    /**
     * Typography - Sweden B2B font
     */
    font: {
        family: "'Open Sans', sans-serif",
    },

    /**
     * Background - Sweden B2B specific
     */
    background: {
        image: `url(${backgroundImage})`,
        color: "transparent",
    },

    /**
     * Component-specific theme values
     */
    header: {
        background: "oklch(100% 0 0)",
    },

    steps: {
        badgeBackgroundColor: "oklch(0.6948 0.1262 151.95)",
        badgeBorderColor: "oklch(0.6948 0.1262 151.95)",
        labelColor: "oklch(70.7% 0.022 261.325)",
        labelActiveColor: "oklch(13% 0.028 261.692)",
        progressLineBackgroundColor: "oklch(0.6948 0.1262 151.95)",
    },
});