import { style } from "@vanilla-extract/css";

export const labelContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: "4px",
});

export const labelTextStyle = style({
    fontSize: "1rem",
    fontWeight: "400",
    color: "oklch(21% 0.006 285.885)",
});

export const subHeaderStyle = style({
    fontSize: "0.875rem",
    color: "oklch(55.1% 0.027 264.364)",
    fontStyle: "italic",
    marginTop: "2px",
});