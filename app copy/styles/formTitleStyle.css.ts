// app copy/styles/formTitleStyle.css.ts
import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const formTitleStyle = style({
    textAlign: "center",
    marginBottom: vars.spacing.largePadding,
});

export const titleStyle = style({
    color: vars.color.baseContent,
    fontWeight: vars.fontWeight.bold,     // ❌ Was vars.font.fontWeightBold
    marginBottom: vars.spacing.tinyPadding,
    fontSize: vars.fontSize.xxxl,         // ❌ Was vars.font.size.xxxlFontSize
    lineHeight: vars.lineHeight.tight,    // ❌ Was vars.font.lineHeight.xxxlLineHeight
});

export const subtitleStyle = style({
    color: vars.color.baseContent,
});