// packages/ui/src/themes/constants.ts

/**
 * Design constants that NEVER change across themes
 * These are layout, spacing, sizing, shadows, and z-index values
 */
export const designConstants = {
    /**
     * Spacing scale - consistent across all themes
     */
    spacing: {
        defaultPadding: "0.25rem", // 4px
        tinyPadding: "0.5rem", // 8px
        smallPadding: "1rem", // 16px
        basicPadding: "1.5rem", // 24px
        largePadding: "2rem", // 32px
    },

    /**
     * Size scale - consistent across all themes
     */
    size: {
        xs: "0.5rem", // 8px
        s: "1rem", // 16px
        m: "1.5rem", // 24px
        l: "2rem", // 32px
        xl: "2.5rem", // 40px
        xxl: "3rem", // 48px
        xxxl: "3.5rem", // 56px
        huge: "4rem", // 64px
    },

    /**
     * Border radius scale - consistent across all themes
     */
    radius: {
        sm: "0.125rem", // 2px
        md: "0.25rem", // 4px
        lg: "0.5rem", // 8px
        xl: "1rem", // 16px
    },

    /**
     * Typography scale - sizes consistent across themes
     * (font families are theme-specific)
     */
    fontSize: {
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        xxl: "1.5rem", // 24px
        xxxl: "1.875rem", // 30px
    },

    fontWeight: {
        normal: "400",
        medium: "500",
        semiBold: "600",
        bold: "700",
    },

    lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
    },

    /**
     * Width constraints - consistent across all themes
     */
    width: {
        full: "100%",
        containerSm: "24rem", // 384px
        containerMd: "28rem", // 448px
        containerLg: "32rem", // 512px
        containerXl: "36rem", // 576px
        container2xl: "42rem", // 672px
        container6xl: "72rem", // 1152px
    },

    /**
     * Shadow styles - consistent across all themes
     */
    shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        custom: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
        strong: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },

    /**
     * Z-index scale - consistent layering across all themes
     */
    zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        modalBackdrop: "1040",
        modal: "1050",
        popover: "1070",
        popoverDropdown: "1080",
        tooltip: "1100",
    },

    /**
     * Layout constants - header/footer dimensions
     */
    layout: {
        header: {
            minHeight: "76px",
            position: "relative" as const,
            width: "100%",
            zIndex: "10",
        },
    },

    /**
     * Transition/animation durations - consistent timing
     */
    transitions: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
    },
} as const;
