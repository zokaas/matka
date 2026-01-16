import { buttonStyles } from "@ui/button";
import { themeVars, designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const statusPageContainer = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeVars.color.baseWhite100,
    padding: designConstants.spacing.largePadding,
});

export const statusPageHeader = style({
    fontSize: designConstants.fontSize.xxxl,
    lineHeight: designConstants.lineHeight.relaxed,
    fontWeight: designConstants.fontWeight.bold,
    color: themeVars.color.baseContent,
});

export const statusPageBodyText = style({
    fontSize: designConstants.fontSize.xl,
    lineHeight: designConstants.lineHeight.normal,
    fontWeight: designConstants.fontWeight.medium,
    color: themeVars.color.baseContent,
    marginTop: designConstants.spacing.basicPadding,
});

export const statusPageButton = style([
    buttonStyles,
    {
        marginTop: designConstants.spacing.basicPadding,
    },
]);
