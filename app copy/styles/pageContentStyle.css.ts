import { designConstants } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const pageContentStyle = style({
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    paddingBlock: designConstants.spacing.basicPadding,
    // Remove paddingInline - let child containers handle horizontal spacing
});