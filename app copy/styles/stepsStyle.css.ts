// app copy/styles/stepsStyle.css.ts
import { vars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const badgeActiveStyle = style({
    backgroundColor: vars.steps.badgeBackgroundColor,  // ❌ Was badge.backgroudColor (typo)
    borderColor: vars.steps.badgeBorderColor,          // ❌ Was badge.borderColor
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
    backgroundColor: vars.steps.progressLineBackgroundColor, // ❌ Was progressLine.backgroundColor
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
    color: vars.steps.labelColor,       // ❌ Was label.color
    fontSize: vars.steps.labelFontSize, // ❌ Was label.fontSize
    marginTop: vars.steps.labelMarginTop, // ❌ Was label.marginTop
});

export const labelActiveStyle = style({
    color: vars.steps.labelActiveColor, // ❌ Was label.activeColor
});