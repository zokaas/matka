import { style } from "@vanilla-extract/css";

export const modalStyles = style({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
});

export const modalContentContainer = style({
    background: "white",
    borderRadius: 8,
    padding: "2rem",
    maxWidth: 400,
    textAlign: "center",
});

export const actionBlock = style({
    marginTop: "1.5rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
});
