// ErrorMessage/styles.css.ts
import { style } from "@vanilla-extract/css";

export const errorMessageStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "4px",
    fontSize: "14px",
    color: "#dc2626", // red-600
    lineHeight: "1.4",
});

export const errorTextStyle = style({
    display: "block",
});