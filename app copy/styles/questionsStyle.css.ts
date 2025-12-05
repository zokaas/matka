// app/styles/questionsStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants } from "@ui/themes";

/**
 * Questions Component Styles
 * Wrapper for form questions/fields
 */

export const questionsContainerStyle = style({
    // Structure
    padding: 0,
    margin: 0,
    marginBottom: designConstants.spacing.basicPadding,
    width: "100%",
    minWidth: "100%",
});

export const questionItemStyle = style({
    // Structure
    marginBottom: designConstants.spacing.smallPadding,
    width: "100%",
});

export const questionGroupStyle = style({
    // Structure
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.smallPadding,
    marginBottom: designConstants.spacing.basicPadding,
});