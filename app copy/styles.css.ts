// app/styles.css.ts
import { themeVars, getThemeClass } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const bodyStyles = style({
    backgroundColor: themeVars.color.baseWhite100,
    backgroundImage: themeVars.background.image,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
});

export const bodyStylesThemeClass = getThemeClass('sweden-b2b-application');