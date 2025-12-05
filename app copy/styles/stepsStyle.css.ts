// app/styles/stepsStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

/**
 * App-specific Steps overrides
 * These styles override or extend the base steps component styles
 * for application-specific needs
 */

// Override for steps wrapper in app context
export const appStepsWrapperStyle = style({
    // Structure
    marginTop: designConstants.spacing.largePadding,
    marginBottom: designConstants.spacing.largePadding,
    padding: `0 ${designConstants.spacing.smallPadding}`,
    
    // Appearance - could add app-specific background if needed
    // backgroundColor: themeVars.color.baseWhite100,
});

// Custom step indicator for app
export const appStepNumberStyle = style({
    // Structure
    fontSize: designConstants.fontSize.sm,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: designConstants.lineHeight.tight,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

// App-specific active step highlight
export const appActiveStepStyle = style({
    // Appearance
    color: themeVars.color.primary,
    fontWeight: designConstants.fontWeight.bold,
});

// Custom step label for app context  
export const appStepLabelStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    marginTop: designConstants.spacing.tinyPadding,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.steps.labelColor,
    fontFamily: themeVars.font.family,
});

// App-specific completed step styling
export const appCompletedStepStyle = style({
    // Appearance
    color: themeVars.steps.labelActiveColor,
    fontWeight: designConstants.fontWeight.semiBold,
});