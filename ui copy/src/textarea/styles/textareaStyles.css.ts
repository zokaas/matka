import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const textareaContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
});

export const textareaFieldStyle = style({
    width: "100%",
    minHeight: "100px",
    padding: designConstants.spacing.tinyPadding,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: designConstants.radius.md,
    border: "1px solid",
    resize: "vertical",
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
        borderColor: themeVars.color.primary,
        boxShadow: `0 0 0 3px ${themeVars.color.primary}33`,
    },

    ":disabled": {
        backgroundColor: themeVars.color.baseWhite200,
        color: themeVars.color.baseGray500,
        cursor: "not-allowed",
        opacity: 0.6,
    },
});
