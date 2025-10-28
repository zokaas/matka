import { style } from "@vanilla-extract/css";

export const radiogroupContainerStyle = style({
    flexGrow: 1,
});

export const radiogroupRootStyle = style({
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
});

export const radioItemContainerStyle = style({
    display: "flex",
    alignItems: "center",
});

export const radioLabelStyle = style({
    color: "oklch(21% 0.006 285.885)",
    fontSize: "1rem",
    lineHeight: "1.5rem",
    paddingLeft: "1rem",
});

export const radiogroupLabelStyle = style({
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
});

export const radioItemStyle = style({
    all: "unset",
    backgroundColor: "white",
    width: "25px",
    height: "25px",
    borderRadius: " 100%",
    border: "1px solid green",
    boxShadow: "0 2px 10px var(--black-a7)",
    ":hover": {
        backgroundColor: "blue",
    },
    ":focus": {
        boxShadow: "0 0 0 2px black",
    },
});

export const radioIndicatorStyle = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    "::after": {
        content: "",
        display: "block",
        width: "11px",
        height: "11px",
        borderRadius: "50%",
        backgroundColor: "violet",
    },
});

/* 
.RadioGroupItem {
	background-color: white;
	width: 25px;
	height: 25px;
	border-radius: 100%;
	box-shadow: 0 2px 10px var(--black-a7);
}
.RadioGroupItem:hover {
	background-color: var(--violet-3);
}
.RadioGroupItem:focus {
	box-shadow: 0 0 0 2px black;
}

.RadioGroupIndicator {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	position: relative;
}
.RadioGroupIndicator::after {
	content: "";
	display: block;
	width: 11px;
	height: 11px;
	border-radius: 50%;
	background-color: var(--violet-11);
}

 */
