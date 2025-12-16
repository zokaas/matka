import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const labelContainerStyle = style({
    display: "flex",
    flexDirection: "column",
});

export const labelTextStyle = style({
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    wordWrap: "break-word",
    color: themeVars.color.baseContent,
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
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.relaxed,
    marginTop: designConstants.spacing.defaultPadding,
    wordWrap: "break-word",
    color: themeVars.color.baseGray500,
});
