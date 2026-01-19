import {
    AppTheme,
    ColorPalette,
    Radii,
    ShadowType,
    FontSize,
    ColorsType,
    FontFamilyProps,
    Size,
    Breakpoints,
    FontMargins,
    FontPaddings,
} from "../types";

const breakpoints: Breakpoints = ["786px", "1080px"];

const colorPalette: ColorPalette = {
    primary: ["#0c445c", "rgba(148, 185, 58, 0.7)", "rgba(148, 185, 58, 0.8)", "#c3c8b4"],
    secondary: ["#085772", "#5593a8", "#508395", "#b7c3c7"],
    tertiary: ["rgba(12, 68, 92, 0.5)", "#2bace2", "#ffffff", "#d297ca", "#fafafa"],
    green: ["#94b93a", "rgba(148, 185, 58, 0.7)", "rgba(148, 185, 58, 0.8)", "#c3c8b4"],
    white: ["#ffffff", "#fdfeff"],
    black: ["rgba(0, 0, 0, 0.2)"],
    reds: ["darkred"],
    orange: ["#e25210"],
};

const colors: ColorsType = {
    background: colorPalette.white[0],
    secondaryBackground: colorPalette.white[1],
    text: colorPalette.primary[0],
    primary: colorPalette.primary[0],
    primaryHover: colorPalette.primary[0],
    primaryPressed: colorPalette.primary[2],
    primaryInactive: colorPalette.primary[3],
    secondary: colorPalette.secondary[0],
    secondaryHover: colorPalette.secondary[1],
    secondaryPressed: colorPalette.secondary[2],
    secondaryInactive: colorPalette.secondary[3],
    tertiary: colorPalette.tertiary[0],
    tertiaryHover: colorPalette.tertiary[1],
    tertiaryPressed: colorPalette.tertiary[2],
    logout: colorPalette.white[1],
    logoutPressed: colorPalette.primary[0],
    black: colorPalette.black[0],
    green: colorPalette.green[0],
    mobileNavigationMorePageBackground: colorPalette.tertiary[2],
    mobileNavigationBackground: colorPalette.white[0],
    error: colorPalette.reds[0],
    blue: [
        colorPalette.tertiary[0],
        colorPalette.tertiary[1],
        colorPalette.tertiary[3],
        colorPalette.tertiary[4],
    ],
    orange: colorPalette.orange[0],
};

const shadows: ShadowType = [
    `0 3px 4px 0 ${colors.black}`,
    `0 2px 2px 0 ${colors.tertiary}`,
    `0 2px 2px 0 ${colors.tertiaryHover}`,
];

const radii: Radii = {
    primary: "8px",
    button: "5px",
};

const fontSizes: FontSize = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];

const sizes: Size = ["8px", "12px", "14px", "16px", "18px", "20px", "24px", "32px"];

const fontMargins: FontMargins = ["0", "8px", "18px", "20px", "22px", "24px", "32px"];

const fontPaddings: FontPaddings = ["0", "8px", "18px", "0", "22px", "24px", "0"];

const fonts: FontFamilyProps = {
    basic: "arial",
};

export const theme: AppTheme = {
    colors,
    fonts: {
        basic: "arial",
    },
    fontSizes,
    boxShadows: {
        primary: shadows[0],
    },
    fontMargins,
    fontPaddings,
    radii,
    sizes: {
        primary: sizes[6],
        secondary: sizes[0],
        tertiary: sizes[2],
        medium: sizes[3],
        large: sizes[7],
    },
    paddings: {
        content: "24px",
        pageTitle: "24px 22px",
        modalContent: "32px",
    },
    breakpoints,
    mediaQueries: {
        small: `@media screen and (max-width: ${breakpoints[0]})`,
        medium: `@media screen and (min-width: ${breakpoints[0]}) and (max-width: ${breakpoints[1]})`,
        large: `@media screen and (min-width: ${breakpoints[1]})`,
    },
    mobileNavigation: {
        background: colors.mobileNavigationBackground,
        morePage: {
            background: colors.mobileNavigationMorePageBackground,
        },
    },
    buttons: {
        primary: {
            border: "0",
            color: colorPalette.white[0],
            fontSize: fontSizes[4],
            fontFamily: fonts.basic,
            borderRadius: radii.button,
            backgroundColor: colorPalette.green[0],
            fontWeight: "bold",
            padding: "5px 24px",
            letterSpacing: "2px",
            cursor: "pointer",
            ":hover": {
                backgroundColor: colorPalette.green[1],
            },
            ":active": {
                backgroundColor: colorPalette.green[2],
            },
            ":disabled": {
                backgroundColor: colorPalette.green[3],
                cursor: "default",
            },
        },
        secondary: {
            border: "0",
            color: colorPalette.white[0],
            fontSize: fontSizes[2],
            fontFamily: fonts.basic,
            borderRadius: radii.button,
            backgroundColor: colors.secondary,
            padding: "8px 24px",
            letterSpacing: "0.5px",
            cursor: "pointer",
            ":hover": {
                backgroundColor: colors.secondaryHover,
            },
            ":active": {
                backgroundColor: colors.secondaryPressed,
            },
            ":disabled": {
                backgroundColor: colors.secondaryInactive,
                cursor: "default",
            },
        },
        large: {
            color: colorPalette.primary[0],
            borderRadius: radii.button,
            backgroundColor: colorPalette.white[0],
            fontFamily: fonts.basic,
            border: "0",
            boxShadow: shadows[1],
            cursor: "pointer",
            ":hover": {
                boxShadow: shadows[2],
            },
            ":active": {
                backgroundColor: colors.tertiaryPressed,
                boxShadow: shadows[2],
            },
            ":disabled": {
                opacity: 0.5,
                boxShadow: shadows[1],
                backgroundColor: colorPalette.white[0],
                cursor: "default",
            },
        },
        logout: {
            color: colors.primary,
            fontSize: fontSizes[0],
            fontFamily: fonts.basic,
            borderRadius: radii.button,
            backgroundColor: colors.logout,
            padding: "8px 6px",
            border: "1px solid #0c445c",
            width: "100%",
            cursor: "pointer",
            ":hover": {
                color: colors.tertiaryHover,
                border: `1px solid ${colors.tertiaryHover}`,
            },
            ":active": {
                color: colors.logoutPressed,
                border: `1px solid ${colors.logoutPressed}`,
            },
        },
        login: {
            fontFamily: fonts.basic,
            fontWeight: "bold",
            fontSize: fontSizes[0],
            color: colorPalette.white[0],
            backgroundColor: colorPalette.tertiary[1],
            borderRadius: radii.button,
            border: 0,
            height: "32px",
            padding: "0 4px 0 4px",
            margin: 0,
        },
    },
    appHeader: {
        boxShadow: shadows[0],
        colors: {
            background: colorPalette.white[0],
        },
    },
    footer: {
        colors: {
            background: colorPalette.tertiary[2],
            primary: colorPalette.tertiary[3],
            secondary: colorPalette.tertiary[4],
            text: colorPalette.primary[0],
        },
        fontSizes,
    },
    modal: {
        dialog: {
            default: {
                position: ["absolute", "relative"],
                padding: ["16px", "32px"],
                margin: "auto",
                backgroundColor: colors.secondaryBackground,
                borderRadius: [0, radii.primary],
                boxShadow: shadows[0],
                width: ["100%", "900px"],
                left: [0, "auto"],
                right: [0, "auto"],
                top: ["64px", "auto"],
                bottom: ["56px", "auto"],
                overflowY: ["scroll", "visible"],
                color: colors.text,
                fontFamily: fonts.basic,
            },
        },
        title: {
            default: {
                color: colors.text,
                fontSize: fontSizes[3],
                fontWeight: "bold",
                lineHeight: 1.25,
                margin: "0 0 8px 0",
                display: "flex",
                flexDirection: "row",
                fontFamily: fonts.basic,
            },
        },
    },
    table: {
        table: {
            border: "1px solid #E3E3E3",
        },
        header: {
            fontFamily: "arial",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#0c445c",
        },
        cell: {
            fontFamily: "arial",
            fontSize: "14px",
            fontWeight: "normal",
            color: "#0c445c",
            height: "32px",
        },
        pagination: {
            fontFamily: "arial",
            fontSize: "14px",
            fontWeight: "normal",
            color: "#0c445c",
        },
    },
    grid: {
        maxWidth: "976px",
        gap: "12px",
    },
};
