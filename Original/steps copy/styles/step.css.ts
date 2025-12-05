// ui/src/steps/styles/step.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const stepContainerStyle = style({
    position: "relative",
    zIndex: 1,
});

export const stepCircleStyle = style({
    // Structure
    width: designConstants.size.xl,
    height: designConstants.size.xl,
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    transition: designConstants.transitions.slower,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite200,
    borderColor: themeVars.color.baseWhite300,
});

export const stepCircleCompletedStyle = style({
    // Appearance - uses theme-specific step colors
    backgroundColor: themeVars.steps.badgeBackgroundColor,
    borderColor: themeVars.steps.badgeBorderColor,
});

export const stepCountSyle = style({
    // Structure
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.tight,
    fontWeight: designConstants.fontWeight.normal,
    
    // Appearance
    color: themeVars.steps.labelColor,
    fontFamily: themeVars.font.family,
});

export const stepActiveStyle = style({
    // Appearance
    color: themeVars.color.baseWhite100,
    fontWeight: designConstants.fontWeight.semiBold,
});

export const stepDoneStyle = style({
    // Structure
    fontSize: designConstants.fontSize.xl,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: "1",
    
    // Visual trick for checkmark
    transform: "scaleX(-1) rotate(-46deg)",
    marginTop: "-5px",
    marginRight: "-3px",
    
    // Appearance
    color: themeVars.color.baseWhite100,
    fontFamily: themeVars.font.family,
});

// Step Label styles
export const stepLabelContainerStyle = style({
    // Structure
    position: "absolute",
    top: "65px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
});

export const stepLabelStyle = style({
    // Structure
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.normal,
    marginTop: designConstants.spacing.tinyPadding,
    
    // Appearance
    color: themeVars.steps.labelColor,
    fontFamily: themeVars.font.family,
});

export const stepActiveLabelStyle = style({
    // Appearance
    color: themeVars.steps.labelActiveColor,
    fontWeight: designConstants.fontWeight.semiBold,
});