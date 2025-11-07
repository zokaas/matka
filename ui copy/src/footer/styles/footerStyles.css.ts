import { style } from "@vanilla-extract/css";

export const footerStyle = style({
    width: "100%",
    paddingTop: "2.5rem",
    paddingBottom: "2.5rem",
    marginTop: "auto",
    maxWidth: "72rem",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
});

export const footerSectionContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    textAlign: "center",

    "@media": {
        "screen and (min-width: 768px)": {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
        },
    },
});

export const footerSectionStyle = style({
    flex: "1",
    minWidth: "200px",
    maxWidth: "300px",

    "@media": {
        "screen and (min-width: 768px)": {
            textAlign: "center",
        },
    },
});

export const footerHeadingStyle = style({
    fontSize: "1.125rem",
    fontWeight: "500",
    marginBottom: "0.75rem",
    color: "#ffffff",
});

export const footerTextStyle = style({
    fontSize: "0.875rem",
    color: "#ffffff",
});
