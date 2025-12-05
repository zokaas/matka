import { vars, themeClass } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const bodyStyles = style({
    backgroundColor: vars.color.baseWhite100,
    backgroundImage: vars.background.image,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
});

export const bodyStylesThemeClass = themeClass;
