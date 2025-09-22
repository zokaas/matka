import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const pageContentStyle = style({
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    //paddingInline: vars.spacing.basicPadding,
    paddingBlock: vars.spacing.basicPadding,
});
