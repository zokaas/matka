import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const filterContainerStyle = style({
    display: "inline-flex",
    width: designConstants.width.full,
    padding: designConstants.spacing.tinyPadding,
    borderBottom: "1px solid",
    boxSizing: "border-box",

    borderColor: themeVars.color.baseWhite400,
});

export const filterInputStyle = style({
    // Structure
    width: designConstants.width.full,
    padding: designConstants.spacing.tinyPadding,
    margin: designConstants.spacing.tinyPadding,
    marginRight: "11px",
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: designConstants.radius.md,
    border: "1px solid",
    boxSizing: "border-box",
    transition: `all ${designConstants.transitions.base}`,

    borderColor: themeVars.color.baseWhite400,
    backgroundColor: themeVars.color.baseWhite100,
    color: themeVars.color.baseContent,

    "::placeholder": {
        color: themeVars.color.baseGray500,
        opacity: 0.6,
    },

    ":hover": {
        borderColor: themeVars.color.baseWhite200,
    },

    ":focus": {
        outline: "none",
        boxShadow: `0 0 0 2px ${themeVars.color.primary}33`,
    },
});
