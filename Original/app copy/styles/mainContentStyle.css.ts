// app/styles/mainContentStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const mainContentStyle = style({
    // Structure
    paddingInline: designConstants.spacing.smallPadding,
    paddingBlock: designConstants.spacing.basicPadding,
    flexGrow: 1,
    
    "@media": {
        "(width >= 48rem)": {
            paddingInline: designConstants.spacing.basicPadding,
        },
    },
});

export const mainContainerStyle = style({
    // Structure
    padding: designConstants.spacing.largePadding,
    maxWidth: designConstants.width.container2xl,
    marginInline: "auto",
    boxShadow: designConstants.shadows.xl,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
});

export const formQuestionsContainer = style({
    // Structure
    marginTop: designConstants.spacing.basicPadding,
    minHeight: "300px",
    maxWidth: designConstants.width.container2xl,
    marginLeft: "auto",
    marginRight: "auto",
});