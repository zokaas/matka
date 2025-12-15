import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const headerStyles = style({
    minHeight: designConstants.layout.header.minHeight,
    width: designConstants.layout.header.width,
    position: designConstants.layout.header.position,
    zIndex: designConstants.layout.header.zIndex,

    backgroundColor: themeVars.header.backgroundColor,
    boxShadow: themeVars.header.boxShadow,
});

export const headerContentContainer = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: designConstants.width.container6xl,
    height: "100%",
    marginInline: "auto",
    paddingInline: designConstants.spacing.basicPadding,
    paddingTop: "6px",
});

export const headerLogoContainer = style({
    flexShrink: 0,
});

export const headerLogoImage = style({
    height: "80px",
    width: "auto",
    minWidth: "200px",

    backgroundImage: themeVars.assets.logo,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center left",

    "@media": {
        "screen and (max-width: 768px)": {
            height: "64px",
            minWidth: "160px",
        },
    },

    selectors: {
        "&": {
            width: "auto !important",
        },
    },
});

export const headerTitle = style({
    fontSize: designConstants.fontSize.xxl,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: designConstants.lineHeight.tight,
    color: themeVars.color.baseContent,

    "@media": {
        "screen and (max-width: 768px)": {
            fontSize: designConstants.fontSize.lg,
        },
    },
});
