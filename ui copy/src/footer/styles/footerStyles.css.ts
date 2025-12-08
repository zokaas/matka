// ui/src/footer/styles/footerStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const footerStyle = style({
    // Structure
    width: "100%",
    paddingTop: designConstants.spacing.largePadding,
    paddingBottom: designConstants.spacing.largePadding,
    marginTop: "auto",
    maxWidth: designConstants.width.container6xl,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: designConstants.spacing.basicPadding,
    paddingRight: designConstants.spacing.basicPadding,
});

export const footerSectionContainerStyle = style({
    // Structure
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: designConstants.spacing.largePadding,
    textAlign: "center",

    "@media": {
        "screen and (min-width: 768px)": {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
        },
    },
});

export const footerSectionStyle = style({
    // Structure
    flex: "1",
    minWidth: "200px",
    maxWidth: "300px",

    "@media": {
        "screen and (min-width: 768px)": {
            textAlign: "center",
        },
    },
});

export const footerHeadingStyle = style({
    // Structure
    fontSize: designConstants.fontSize.lg,
    fontWeight: designConstants.fontWeight.medium,
    lineHeight: designConstants.lineHeight.normal,
    marginBottom: designConstants.spacing.smallPadding,
    
    // Appearance
    color: themeVars.color.baseWhite100,
    
});

export const footerTextStyle = style({
    // Structure
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseWhite100,
    
});