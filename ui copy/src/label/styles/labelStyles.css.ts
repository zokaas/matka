// ui/src/label/styles/labelStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const labelContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
});

export const labelTextStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    wordWrap: "break-word",
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

export const labelWithTooltipStyle = style({
    display: "flex",
    alignItems: "center",
    gap: designConstants.spacing.tinyPadding,
});

export const tooltipWrapperStyle = style({
    flexShrink: 0,
    alignSelf: "center",
    lineHeight: "1",
});

export const subHeaderStyle = style({
    // Structure
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.relaxed,
    fontStyle: "italic",
    marginTop: designConstants.spacing.defaultPadding,
    wordWrap: "break-word",
    
    // Appearance
    color: themeVars.color.baseGray500,
    fontFamily: themeVars.font.family,
});