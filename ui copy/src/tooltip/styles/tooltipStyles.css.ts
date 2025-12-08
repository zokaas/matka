import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const tooltipTriggerStyles = style({
    all: "unset",
    width: designConstants.size.s,
    height: designConstants.size.s,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: designConstants.fontSize.sm,
    fontWeight: designConstants.fontWeight.bold,
    cursor: "pointer",
    transition: `background-color ${designConstants.transitions.base}`,
    
    backgroundColor: themeVars.color.primary,
    color: themeVars.color.primaryContent,
    
    ":focus": {
        outline: `2px solid ${themeVars.color.primary}`,
        outlineOffset: "2px",
    },
});

export const tooltipContentStyles = style({
    maxWidth: "300px",
    padding: `${designConstants.spacing.smallPadding} ${designConstants.spacing.smallPadding}`,
    borderRadius: designConstants.radius.md,
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.relaxed,
    border: "1px solid",
    boxShadow: designConstants.shadows.lg,
    zIndex: designConstants.zIndex.tooltip,
    
    backgroundColor: themeVars.color.baseWhite100,
    color: themeVars.color.baseContent,
    borderColor: themeVars.color.baseWhite400,
    
});

export const tooltipArrowStyles = style({
    fill: themeVars.color.baseWhite100,
    stroke: themeVars.color.baseWhite400,
    strokeWidth: "1px",
});

export const tooltipHeaderStyles = style({
    margin: `0 0 ${designConstants.spacing.tinyPadding} 0`,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: designConstants.lineHeight.normal,
    
    color: themeVars.color.baseContent,
    
});

export const tooltipDescriptionStyles = style({
    margin: "0",
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.normal,
    
    color: themeVars.color.baseGray500,
    
});