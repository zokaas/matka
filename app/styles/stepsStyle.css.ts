import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const badgeActiveStyle = style({
    /* Other Css styles can also be added */
    backgroundColor: vars.steps.badge.backgroudColor,
    borderColor: vars.steps.badge.borderColor,
});

export const progressLineActiveStyle = style({
    backgroundColor: vars.steps.progressLine.backgroundColor,
});

export const labelStyle = style({
    color: vars.steps.label.color,
    fontSize: vars.steps.label.fontSize,
    marginTop: vars.steps.label.marginTop,
});

export const labelActiveStyle = style({
    color: vars.steps.label.activeColor,
});
