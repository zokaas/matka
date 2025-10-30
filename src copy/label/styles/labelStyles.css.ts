import { style } from "@vanilla-extract/css";

export const labelContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

export const labelTextStyle = style({
    fontSize: "16px",
    fontWeight: "400",
    color: "oklch(21% 0.006 285.885)",
    wordWrap: "break-word",
    lineHeight: "1.5",
});

export const labelWithTooltipStyle = style({
    display: "flex",
    alignItems: "center",
    gap: "8px",
});

export const tooltipWrapperStyle = style({
    flexShrink: 0,
    alignSelf: "center",
    lineHeight: "1",
});

export const subHeaderStyle = style({
    fontSize: "0.875rem",
    color: "oklch(55.1% 0.027 264.364)",
    fontStyle: "italic",
    marginTop: "2px",
    wordWrap: "break-word",
    lineHeight: "1.4",
});
