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
    fontSize: vars.font.size.xxxlFontSize,
    lineHeight: vars.size.size_l,
    fontWeight: vars.font.fontWeightBold,
    color: vars.color.baseContent,
});

export const statusPageBodyText = style({
    fontSize: vars.font.size.xlFontSize,
    lineHeight: vars.size.size_m,
    fontWeight: vars.font.fontWeightMedium,
    color: vars.color.baseContent,
    marginTop: vars.spacing.basicPadding,
});

export const statusPageButton = style([
    buttonStyles,
    {
        marginTop: vars.spacing.basicPadding,
    },
]);
