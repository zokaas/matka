// ui/src/header/styles/headerStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const headerStyles = style({
    // Structure - using layout constants
    minHeight: designConstants.layout.header.minHeight,
    width: designConstants.layout.header.width,
    position: designConstants.layout.header.position,
    zIndex: designConstants.layout.header.zIndex,
    boxShadow: designConstants.shadows.md,
    
    // Appearance
    backgroundColor: themeVars.header.background,
});

export const headerContentContainer = style({
    // Structure
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: designConstants.width.container6xl,
    height: "100%",
    marginInline: "auto",
    paddingInline: designConstants.spacing.basicPadding,
    paddingTop: "6px", // Fine-tune for vertical centering
});

export const headerLogoContainer = style({
    flexShrink: 0,
});

export const headerLogoImage = style({
    height: designConstants.size.huge,
    width: "auto",
    maxWidth: "100%",
    
    // Force important to override any global styles
    selectors: {
        "&": {
            height: `${designConstants.size.huge} !important`,
            width: "auto !important",
            maxWidth: "100%",
        },
    },
});

export const headerTitle = style({
    // Structure
    fontSize: designConstants.fontSize.xxl,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: designConstants.lineHeight.tight,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
    
    // Responsive
    "@media": {
        "screen and (max-width: 768px)": {
            fontSize: designConstants.fontSize.lg,
        },
    },
});