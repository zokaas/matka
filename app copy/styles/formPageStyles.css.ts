import { style } from "@vanilla-extract/css";
import { vars } from "@ui/themes";

export const stepsWrapperStyle = style({
    marginBottom: "3rem",
    position: "relative",
    paddingBottom: "3rem",
});

export const dividerStyle = style({
    borderTopWidth: "1px",
    borderColor: vars.color.baseNeutral350,
    marginBottom: vars.spacing.basicPadding,
});

export const buttonContainerStyle = style({
    marginTop: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export const singleButtonContainerStyle = style({
    marginTop: "50px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
});
