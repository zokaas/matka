// app/styles/formPageStyles.css.ts
import { style } from "@vanilla-extract/css";
import { themeVars, designConstants } from "@ui/themes";

export const stepsWrapperStyle = style({
    marginBottom: "3rem",
    position: "relative",
    paddingBottom: "3rem",
});

export const dividerStyle = style({
    borderTopWidth: "1px",
    borderColor: themeVars.color.baseNeutral350,
    marginBottom: designConstants.spacing.basicPadding,
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