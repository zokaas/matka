import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const formTitleStyle = style({
    textAlign: "center",
    marginBottom: vars.spacing.largePadding,
});

export const titleStyle = style({
    color: vars.color.baseContent,
    fontWeight: vars.font.fontWeightBold,
    marginBottom: vars.spacing.tinyPadding,
    fontSize: vars.font.size.xxxlFontSize,
    lineHeight: vars.font.lineHeight.xxxlLineHeight,
});

export const subtitleStyle = style({
    color: vars.color.baseContent,
});
