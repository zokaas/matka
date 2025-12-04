import { style } from "@vanilla-extract/css";

export const modalOverlayStyles = style({
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

export const modalContentContainerStyles = style({
    position: "relative",
    width: "80%",
    maxWidth: "664px",
    height: "auto",
    backgroundColor: "white",
    borderRadius: "0",
    padding: "2rem",
    margin: "20px",
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    color: "oklch(21% 0.006 285.885)",
    fontFamily: "inherit",
    overflowY: "auto",
    maxHeight: "90vh",

    "@media": {
        "screen and (min-width: 768px)": {
            width: "50%",
            padding: "3rem",
        },
    },
});

export const modalTitleStyles = style({
    color: "oklch(21% 0.006 285.885)",
    fontSize: "1.5rem",
    fontWeight: "bold",
    lineHeight: "1.333",
    margin: "0 0 1rem 0",
    textAlign: "center",
    fontFamily: "inherit",
});

export const modalDescriptionStyles = style({
    fontFamily: "inherit",
    fontWeight: "400",
    color: "oklch(21% 0.006 285.885)",
    fontSize: "1rem",
    lineHeight: "1.5",
    margin: "0 0 2rem 0",
    textAlign: "center",
});

export const modalActionBlockStyles = style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1.5rem",

    "@media": {
        "screen and (max-width: 767px)": {
            flexDirection: "column",
            gap: "0.5rem",
        },
    },
});

export const modalButtonStyles = style({
    width: "180px",
    height: "48px",
    padding: "0.75rem 0.5rem",
    margin: "0 0.5rem",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    background: "linear-gradient(to top, #c7c7c7, #fff)",
    border: "none",
    borderRadius: "0",
    fontSize: "1rem",
    fontWeight: "400",
    color: "#373737",
    cursor: "pointer",
    transition: "background-image 0.2s ease",
    fontFamily: "inherit",
    lineHeight: "1.5rem",
    textAlign: "center",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    ":hover": {
        background: "linear-gradient(to top, #bbb, #eee)",
    },

    ":disabled": {
        color: "#cccccc",
        cursor: "not-allowed",
    },

    "@media": {
        "screen and (max-width: 767px)": {
            margin: "0.25rem 0",
            width: "100%",
            whiteSpace: "normal",
        },
    },
});
