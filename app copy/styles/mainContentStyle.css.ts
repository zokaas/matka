import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const mainContentStyle = style({
    paddingInline: vars.spacing.smallPadding,
    "@media": {
        "(width >= 48rem)": {
            paddingInline: vars.spacing.basicPadding,
        },
    },
    flexGrow: 1,
    paddingBlock: vars.spacing.basicPadding,
});

export const mainContainerStyle = style({
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    padding: vars.spacing.largePadding,
    backgroundColor: vars.color.baseWhite100,
    maxWidth: vars.width.container_2xl,
    marginInline: "auto",
});

export const formQuestionsContainer = style({
    marginTop: vars.spacing.basicPadding,
    minHeight: "300px",
    maxWidth: vars.width.container_2xl,
    marginLeft: "auto",
    marginRight: "auto",
});
