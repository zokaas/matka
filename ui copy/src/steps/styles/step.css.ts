import { style } from "@vanilla-extract/css";

export const stepContainerStyle = style({
    position: "relative",
    zIndex: 1,
});

export const stepCircleStyle = style({
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    backgroundColor: "oklch(92.8% 0.006 264.531)", // gray-200
    border: "2px solid oklch(87.2% 0.01 258.338)", // gray-300
    transition: "0.4s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
});

export const stepCountSyle = style({
    color: "oklch(55.1% 0.027 264.364)", // gray-500
    fontSize: "0.875rem", // font-sm
    lineHeight: "0.875", // lien-height-sm
});

export const stepCircleCompletedStyle = style({
    backgroundColor: "oklch(58.5% 0.233 277.117)",
    borderColor: "oklch(58.5% 0.233 277.117)",
});

export const stepActiveStyle = style({
    color: "#ffffff",
});

export const stepDoneStyle = style({
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
    transform: "scaleX(-1) rotate(-46deg)",
    marginTop: "-5px",
    marginRight: "-3px",
});

// Step Label styles
export const stepLabelContainerStyle = style({
    position: "absolute",
    top: "65px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
});

export const stepLabelStyle = style({
    fontSize: "0.875rem", // font-sm
    color: "oklch(70.7% 0.022 261.325)", // gray-400
    marginTop: "0.5rem", // spacing [0.25rem] * 2
});

export const stepActiveLabelStyle = style({
    color: "oklch(13% 0.028 261.692)",
});
