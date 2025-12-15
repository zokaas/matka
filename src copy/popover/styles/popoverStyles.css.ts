import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const popoverButtonStyles = style({
    all: "unset",
    borderRadius: "100%",
    width: designConstants.size.m,
    height: designConstants.size.m,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: `background-color ${designConstants.transitions.base}`,
    boxShadow: designConstants.shadows.base,

    color: themeVars.color.baseWhite100,
    backgroundColor: themeVars.color.baseGreen500,

    ":hover": {
        backgroundColor: themeVars.color.baseGreen410,
        boxShadow: designConstants.shadows.md,
    },

    ":focus": {
        outline: `2px solid ${themeVars.color.primary}`,
        outlineOffset: "2px",
    },
});

export const popoverContentStyles = style({
    padding: designConstants.spacing.basicPadding,
    width: "260px",
    borderRadius: designConstants.radius.md,
    boxShadow: designConstants.shadows.xl,
    zIndex: designConstants.zIndex.popover,

    backgroundColor: themeVars.color.baseWhite100,
    border: `1px solid ${themeVars.color.baseWhite400}`,

    ":focus": {
        outline: "none",
        boxShadow: `${designConstants.shadows.xl}, 0 0 0 2px ${themeVars.color.primary}33`,
    },
});

export const popoverArrowStyles = style({
    fill: themeVars.color.baseWhite100,
});

export const popoverCloseIconStyles = style({
    all: "unset",
    fontFamily: "inherit",
    borderRadius: "100%",
    width: "25px",
    height: "25px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: designConstants.spacing.tinyPadding,
    right: designConstants.spacing.tinyPadding,
    cursor: "pointer",
    transition: `background-color ${designConstants.transitions.base}`,

    color: themeVars.color.baseContent,

    ":hover": {
        backgroundColor: themeVars.color.baseWhite200,
    },

    ":focus": {
        outline: `2px solid ${themeVars.color.primary}`,
        outlineOffset: "2px",
    },
});
