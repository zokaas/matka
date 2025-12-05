// app/styles/pageContentStyle.css.ts
import { designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const pageContentStyle = style({
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    //paddingInline: designConstants.spacing.basicPadding,
    paddingBlock: designConstants.spacing.basicPadding,
});