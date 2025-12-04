// app copy/styles/statusLayoutStyle.css.ts
import { buttonStyles } from "@ui/button";
import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const statusPageContainer = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
});

export const statusPageHeader = style({
    fontSize: vars.fontSize.xxxl,       // ❌ Was vars.font.size.xxxlFontSize
    lineHeight: vars.size.l,
    fontWeight: vars.fontWeight.bold,   // ❌ Was vars.font.fontWeightBold
    color: vars.color.baseContent,
});

export const statusPageBodyText = style({
    fontSize: vars.fontSize.xxl,        // ❌ Was vars.font.size.xxlFontSize
    lineHeight: vars.size.xl,
    fontWeight: vars.fontWeight.medium, // ❌ Was vars.font.fontWeightMedium
    color: vars.color.baseContent,
    marginTop: vars.spacing.basicPadding,
    alignItems: "center",
    textAlign: "center",
});

export const statusPageButton = style([
    buttonStyles,
    {
        marginTop: vars.spacing.basicPadding,
    },
]);