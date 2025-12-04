// app copy/styles/questionsStyle.css.ts
import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const questionsStyle = style({
    padding: 0,
    margin: 0,
    marginBottom: vars.spacing.basicPadding,
    width: vars.width.full,     // ❌ Was fullWidth
    minWidth: vars.width.full,  // ❌ Was fullWidth
});