import { themeVars, designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const formTitleStyle = style({
    textAlign: "center",
    marginBottom: designConstants.spacing.largePadding,
});

export const titleStyle = style({
    color: themeVars.color.baseContent,
    fontWeight: designConstants.fontWeight.bold,
    fontSize: designConstants.fontSize.xxl,
    lineHeight: designConstants.lineHeight.relaxed,
});

export const subtitleStyle = style({
    color: themeVars.color.baseContent,
});
