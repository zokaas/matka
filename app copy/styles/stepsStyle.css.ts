import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const badgeActiveStyle = style({
    /* Other Css styles can also be added */
    backgroundColor: vars.steps.badge.backgroudColor,
    borderColor: vars.steps.badge.borderColor,
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    transition: "0.4s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
});

export const progressLineActiveStyle = style({
    backgroundColor: vars.steps.progressLine.backgroundColor,
    content: "",
    position: "absolute",
    height: "0.25rem",
    width: "100%",
    top: "50%",
    transition: "0.4s ease",
    transform: "translateY(-50%)",
    left: 0,
});

export const labelStyle = style({
    color: vars.steps.label.color,
    fontSize: vars.steps.label.fontSize,
    marginTop: vars.steps.label.marginTop,
});

export const labelActiveStyle = style({
    color: vars.steps.label.activeColor,
});
