// ui/src/tooltip/styles/tooltipStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const tooltipTriggerStyles = style({
    // Structure
    all: "unset",
    width: designConstants.size.s,  // 20px equivalent
    height: designConstants.size.s,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: designConstants.fontSize.sm,
    fontWeight: designConstants.fontWeight.bold,
    cursor: "pointer",
    transition: `background-color ${designConstants.transitions.base}`,
    
    // Appearance
    backgroundColor: themeVars.color.primary,
    color: themeVars.color.primaryContent,
    
    ":hover": {
        backgroundColor: themeVars.color.accent,
    },
    
    ":focus": {
        outline: `2px solid ${themeVars.color.primary}`,
        outlineOffset: "2px",
    },
});

export const tooltipContentStyles = style({
    // Structure
    maxWidth: "300px",
    padding: `${designConstants.spacing.smallPadding} ${designConstants.spacing.smallPadding}`,
    borderRadius: designConstants.radius.md,
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.relaxed,
    border: "1px solid",
    boxShadow: designConstants.shadows.lg,
    zIndex: designConstants.zIndex.tooltip,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    color: themeVars.color.baseContent,
    borderColor: themeVars.color.baseWhite300,
    fontFamily: themeVars.font.family,
});

export const tooltipArrowStyles = style({
    // Appearance
    fill: themeVars.color.baseWhite100,
    stroke: themeVars.color.baseWhite300,
    strokeWidth: "1px",
});

export const tooltipHeaderStyles = style({
    // Structure
    margin: `0 0 ${designConstants.spacing.tinyPadding} 0`,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

export const tooltipDescriptionStyles = style({
    // Structure
    margin: "0",
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseGray500,
    fontFamily: themeVars.font.family,
});