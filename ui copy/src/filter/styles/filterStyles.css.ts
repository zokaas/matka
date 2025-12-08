// ui/src/filter/styles/filterStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const filterContainerStyle = style({
    // Structure
    display: "inline-flex",
    width: designConstants.width.full,
    padding: designConstants.spacing.tinyPadding,
    borderBottom: "1px solid",
    boxSizing: "border-box",
    
    // Appearance
    borderColor: themeVars.color.baseWhite400,
});

export const filterInputStyle = style({
    // Structure
    width: designConstants.width.full,
    padding: designConstants.spacing.tinyPadding,
    margin: designConstants.spacing.tinyPadding,
    marginRight: "11px", // Specific adjustment for scrollbar
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: designConstants.radius.md,
    border: "1px solid",
    boxSizing: "border-box",
    transition: `all ${designConstants.transitions.base}`,
    
    // Appearance
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
        boxShadow: `0 0 0 2px ${themeVars.color.primary}33`,
    },
});