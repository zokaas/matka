// app/styles/formTitleStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const formTitleStyle = style({
    // Structure
    textAlign: "center",
    marginBottom: designConstants.spacing.largePadding,
});

export const titleStyle = style({
    // Structure
    fontSize: designConstants.fontSize.xxxl,
    fontWeight: designConstants.fontWeight.bold,
    lineHeight: designConstants.lineHeight.tight,
    marginBottom: designConstants.spacing.tinyPadding,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

export const subtitleStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});