import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

const bgColor = `color-mix(in oklab, ${vars.color.baseWhite200}, transparent)`;

export const companyInfoContainerStyle = style({
    backgroundColor: bgColor,
    padding: vars.spacing.basicPadding,
    borderRadius: vars.radius.radiusLg,
    marginBottom: vars.spacing.basicPadding,
});

export const companyInfoGridStyle = style({
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    "@media": {
        "(width >= 48rem)": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        },
    },
    gap: vars.spacing.smallPadding,
});

export const companyInfoLabelStyle = style({
    color: vars.color.baseGray100,
    fontWeight: vars.font.fontWeightMedium,
    fontSize: vars.font.size.smFontSize,
    lineHeight: vars.font.lineHeight.smLineHeight,
    marginBottom: vars.spacing.defaultPadding,
});

export const companyInfoStyle = style({
    color: vars.color.baseContent,
    fontWeight: vars.font.fontWeightSemiBold,
    fontSize: vars.font.size.baseFontSize,
    lineHeight: vars.font.lineHeight.baseLineHeight,
});
