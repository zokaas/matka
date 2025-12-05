// ui/src/inputField/styles/inputStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const inputContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
});

export const inputFieldStyle = style({
    // Structure - use designConstants
    width: designConstants.width.full,
    padding: designConstants.spacing.tinyPadding,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: designConstants.radius.md,
    border: "1px solid",
    transition: `all ${designConstants.transitions.base}`,
    
    // Appearance - use themeVars
    borderColor: themeVars.color.baseWhite300,
    backgroundColor: themeVars.color.baseWhite100,
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
    
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