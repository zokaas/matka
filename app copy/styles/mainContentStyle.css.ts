// app/styles/mainContentStyle.css.ts
import { themeVars, designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const mainContentStyle = style({
    paddingInline: designConstants.spacing.smallPadding,
    "@media": {
        "(width >= 48rem)": {
            paddingInline: designConstants.spacing.basicPadding,
        },
    },
    flexGrow: 1,
    paddingBlock: designConstants.spacing.basicPadding,
});

export const mainContainerStyle = style({
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    padding: designConstants.spacing.largePadding,
    backgroundColor: themeVars.color.baseWhite100,
    maxWidth: designConstants.width.container2xl,
    marginInline: "auto",
});

export const formQuestionsContainer = style({
    marginTop: designConstants.spacing.basicPadding,
    minHeight: "300px",
    maxWidth: designConstants.width.container2xl,
    marginLeft: "auto",
    marginRight: "auto",
});