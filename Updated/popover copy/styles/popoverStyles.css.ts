import { style } from "@vanilla-extract/css";

export const popoverButtonStyles = style({
    all: "unset",
    borderRadius: "100%",
    height: "35px",
    width: "35px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    backgroundColor: "green",
    boxShadow: "0 2px 10px #000",
    /*
	&:hover {
		background-color: var(--violet-3);
	}
	&:focus {
		box-shadow: 0 0 0 2px black;
	}
    */
});

export const popoverContentStyles = style({
    borderRadius: "5px",
    padding: "20px",
    width: "260px",
    backgroundColor: "#fff",
    boxShadow:
        "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
    /*
	animation-duration: 400ms;
	animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	will-change: transform, opacity;
	&:focus {
		box-shadow:
			hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
			hsl(206 22% 7% / 20%) 0px 10px 20px -15px,
			0 0 0 2px var(--violet-7);
	}
	&[data-state="open"][data-side="top"] {
		animation-name: slideDownAndFade;
	}
	&[data-state="open"][data-side="right"] {
		animation-name: slideLeftAndFade;
	}
	&[data-state="open"][data-side="bottom"] {
		animation-name: slideUpAndFade;
	}
	&[data-state="open"][data-side="left"] {
		animation-name: slideRightAndFade;
	}

    @keyframes slideUpAndFade {
	from {
		opacity: 0;
		transform: translateY(2px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideRightAndFade {
	from {
		opacity: 0;
		transform: translateX(-2px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes slideDownAndFade {
	from {
		opacity: 0;
		transform: translateY(-2px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideLeftAndFade {
	from {
		opacity: 0;
		transform: translateX(2px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

     */
});

export const popoverArrowStyles = style({
    fill: "#fff",
});

export const popoverCloseIconStyles = style({
    /*     	all: unset;
	font-family: inherit;
	border-radius: 100%;
	height: 25px;
	width: 25px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: var(--violet-11);
	position: absolute;
	top: 5px;
	right: 5px;
	&:hover {
		background-color: var(--violet-4);
	}
	&:focus {
		box-shadow: 0 0 0 2px var(--violet-7);
	} */
});
