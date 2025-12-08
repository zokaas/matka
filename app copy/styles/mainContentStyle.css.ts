import { themeVars, designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const mainContentStyle = style({
    paddingInline: designConstants.spacing.smallPadding, // 16px on mobile
    "@media": {
        "(width >= 48rem)": {
            paddingInline: designConstants.spacing.basicPadding, // 24px on desktop
        },
    },
    flexGrow: 1,
    paddingBlock: designConstants.spacing.basicPadding,
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
});

export const mainContainerStyle = style({
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    padding: designConstants.spacing.largePadding, // 32px internal padding
    backgroundColor: themeVars.color.baseWhite100,
    maxWidth: designConstants.width.container2xl,
    marginInline: "auto",
    width: "100%",
    boxSizing: "border-box",
    
    // Reduce internal padding on mobile
    "@media": {
        "(width < 48rem)": {
            padding: designConstants.spacing.smallPadding, // 16px on mobile instead of 32px
        },
    },
});

export const formQuestionsContainer = style({
    marginTop: designConstants.spacing.basicPadding,
    minHeight: "300px",
    maxWidth: designConstants.width.container2xl,
    marginLeft: "auto",
    marginRight: "auto",
});