// ui/src/error/styles/errorStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const errorContainerStyle = style({
    display: "block",
    marginTop: designConstants.spacing.defaultPadding,
});

export const errorTextStyle = style({
    // Structure
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.normal,
    fontWeight: designConstants.fontWeight.normal,
    
    // Appearance
    color: themeVars.color.error,
    fontFamily: themeVars.font.family,
});