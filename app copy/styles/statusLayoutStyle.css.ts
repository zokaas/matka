// app/styles/statusLayoutStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const statusPageContainer = style({
    // Structure
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
});

export const statusPageHeader = style({
    // Structure
    fontSize: designConstants.fontSize.xxxl,
    fontWeight: designConstants.fontWeight.bold,
    lineHeight: designConstants.size.l,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

export const statusPageBodyText = style({
    // Structure
    fontSize: designConstants.fontSize.xxl,
    fontWeight: designConstants.fontWeight.medium,
    lineHeight: designConstants.size.xl,
    marginTop: designConstants.spacing.basicPadding,
    alignItems: "center",
    textAlign: "center",
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

export const statusPageButton = style({
    // Structure
    marginTop: designConstants.spacing.basicPadding,
    padding: `${designConstants.spacing.tinyPadding} ${designConstants.spacing.smallPadding}`,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.medium,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: designConstants.radius.md,
    border: "none",
    boxShadow: designConstants.shadows.base,
    cursor: "pointer",
    transition: `all ${designConstants.transitions.base}`,
    
    // Appearance
    backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite300}, ${themeVars.color.baseWhite100})`,
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
    
    ":hover": {
        backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite200}, ${themeVars.color.baseWhite100})`,
        boxShadow: designConstants.shadows.md,
    },
});