// app/styles/companyInfoStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

// Using color-mix for subtle background
const bgColor = `color-mix(in oklab, ${themeVars.color.baseWhite200}, transparent)`;

export const companyInfoContainerStyle = style({
    // Structure
    padding: designConstants.spacing.basicPadding,
    borderRadius: designConstants.radius.lg,
    marginBottom: designConstants.spacing.basicPadding,
    
    // Appearance
    backgroundColor: bgColor,
});

export const companyInfoGridStyle = style({
    // Structure
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    gap: designConstants.spacing.smallPadding,
    
    "@media": {
        "(width >= 48rem)": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        },
    },
});

export const companyInfoLabelStyle = style({
    // Structure
    fontSize: designConstants.fontSize.sm,
    fontWeight: designConstants.fontWeight.medium,
    lineHeight: designConstants.lineHeight.normal,
    marginBottom: designConstants.spacing.defaultPadding,
    
    // Appearance
    color: themeVars.color.baseGray100,
    fontFamily: themeVars.font.family,
});

export const companyInfoStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});