import { style } from "@vanilla-extract/css";
import { vars, } from "@ui/themes";

export const stepsWrapperStyle = style({
    marginBottom: "3rem",
    position: "relative",
    paddingBottom: "1rem",
});

export const dividerStyle = style({
  border: 0,
  borderTop: `1px solid ${vars.color.baseGray100}`,
  margin: "1.5rem 0",
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
