// app/styles/pageContentStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants } from "@ui/themes";

export const pageContentStyle = style({
    // Structure
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    paddingBlock: designConstants.spacing.basicPadding,
});