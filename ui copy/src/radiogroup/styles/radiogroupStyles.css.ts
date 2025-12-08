// ui/src/radiogroup/styles/radiogroupStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const radiogroupContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
});

export const radiogroupRootStyle = style({
    display: "flex",
    flexDirection: "row",
    gap: designConstants.spacing.smallPadding,
});

export const radioItemContainerStyle = style({
    display: "flex",
    alignItems: "center",
    gap: designConstants.spacing.tinyPadding,
});

export const radioLabelStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    paddingLeft: designConstants.spacing.smallPadding,
    cursor: "pointer",
    
    // Appearance
    color: themeVars.color.baseContent,
    
});

export const radiogroupLabelStyle = style({
    // Structure
    display: "block",
    marginBottom: designConstants.spacing.tinyPadding,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.medium,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseContent,
    
});

export const radioItemStyle = style({
    // Structure
    all: "unset",
    width: "25px",
    height: "25px",
    borderRadius: "100%",
    border: "1px solid",
    boxShadow: designConstants.shadows.sm,
    cursor: "pointer",
    transition: `all ${designConstants.transitions.base}`,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.primary,
    
    ":hover": {
        backgroundColor: themeVars.color.baseWhite200,
        boxShadow: designConstants.shadows.base,
    },
    
    ":focus": {
        outline: `2px solid ${themeVars.color.primary}`,
        outlineOffset: "2px",
    },
    
    ":disabled": {
        backgroundColor: themeVars.color.baseWhite400,
        borderColor: themeVars.color.baseGray500,
        cursor: "not-allowed",
        opacity: 0.6,
    },
});

export const radioIndicatorStyle = style({
    // Structure
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    
    // Inner dot
    "::after": {
        content: "",
        display: "block",
        width: "11px",
        height: "11px",
        borderRadius: "50%",
        backgroundColor: themeVars.color.primary,
    },
});