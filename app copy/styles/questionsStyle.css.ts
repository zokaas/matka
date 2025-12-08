import { designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const questionsStyle = style({
    padding: 0,
    margin: 0,
    marginBottom: designConstants.spacing.basicPadding,
    width: designConstants.width.full,
    minWidth: designConstants.width.full,
});