import { themeVars, designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

const bgColor = `color-mix(in oklab, ${themeVars.color.baseWhite200}, transparent)`;

export const companyInfoContainerStyle = style({
    backgroundColor: bgColor,
    padding: designConstants.spacing.smallPadding,
    borderRadius: designConstants.radius.lg,
    marginBottom: designConstants.spacing.smallPadding,
});

export const companyInfoGridStyle = style({
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    "@media": {
        "(width >= 48rem)": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        },
    },
});

export const companyInfoLabelStyle = style({
    color: themeVars.color.baseGray100,
    fontWeight: designConstants.fontWeight.medium,
    fontSize: designConstants.fontSize.sm,
    marginBottom: designConstants.spacing.smallPadding,
});

export const companyInfoStyle = style({
    color: themeVars.color.baseContent,
    fontWeight: designConstants.fontWeight.semiBold,
    fontSize: designConstants.fontSize.base,
});
