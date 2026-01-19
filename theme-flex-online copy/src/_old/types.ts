import * as CSSType from "csstype";

export type BasicThemeValue = string | number;
export type Breakpoints = string[];
export type BasicCssValue = number | string | number[] | string[] | (string | number)[];

export type Radii = {
    primary: string;
    secondary?: string;
    button?: string;
};

export type ColorPalette = {
    primary: string[];
    secondary: string[];
    tertiary: string[];
    green: string[];
    white: string[];
    black: string[];
    reds: string[];
    orange: string[];
};

export type ShadowType = string[];

export type FontSize = string[];

export type Size = string[];

export type FontFamilyProps = {
    basic: string;
};

export type Fonts = {
    basic: string;
};

export type ButtonPropreties = {
    color?: string;
    cursor?: string;
    backgroundColor?: string;
    bg?: string;
    border?: BasicThemeValue;
    borderRadius?: string;
    radii?: string;
    boxShadow?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontSize?: string;
    letterSpacing?: string;
    padding?: BasicThemeValue;
    margin?: BasicThemeValue;
    width?: string;
    height?: string;
    opacity?: BasicThemeValue;
    ":hover"?: ButtonPropreties;
    ":active"?: ButtonPropreties;
    ":disabled"?: ButtonPropreties;
};

export type ColorsType = {
    background?: string;
    secondaryBackground?: string;
    text?: string;
    primary?: string;
    primaryHover?: string;
    primaryPressed?: string;
    primaryInactive?: string;
    secondary?: string;
    secondaryHover?: string;
    secondaryPressed?: string;
    secondaryInactive?: string;
    tertiary?: string;
    tertiaryHover?: string;
    tertiaryPressed?: string;
    tertiaryInactive?: string;
    logout?: string;
    logoutHover?: string;
    logoutPressed?: string;
    footerTitle?: string;
    footerBg?: string;
    black?: string;
    green?: string;
    mobileNavigationMorePageBackground?: string;
    mobileNavigationBackground?: string;
    error?: string;
    blue?: string[];
    orange?: string;
};

export type PaddingsType = {
    content: string;
    pageTitle: string;
    modalContent?: string | string[];
};

export type FontPaddings = string[];
export type FontMargins = string[];

export type ModalType = {
    position?: string | string[];
    padding?: string | string[];
    margin?: string;
    backgroundColor?: string;
    borderRadius?: BasicCssValue;
    boxShadow?: string;
    width?: BasicCssValue;
    left?: BasicCssValue;
    right?: BasicCssValue;
    top?: BasicCssValue;
    bottom?: BasicCssValue;
    overflowY?: string | string[];
    color?: string;
    fontFamily?: string;
};

export type TableTheme = {
    table: {
        border: CSSType.BorderProperty<1>;
    };
    header: {
        fontFamily: CSSType.FontFamilyProperty;
        fontSize: CSSType.FontSizeProperty<1>;
        fontWeight: CSSType.FontWeightProperty;
        color: CSSType.ColorProperty;
    };
    cell: {
        fontFamily: CSSType.FontFamilyProperty;
        fontSize: CSSType.FontSizeProperty<1>;
        fontWeight: CSSType.FontWeightProperty;
        color: CSSType.ColorProperty;
        height: CSSType.HeightProperty<1>;
    };
    pagination: {
        fontFamily: CSSType.FontFamilyProperty;
        fontSize: CSSType.FontSizeProperty<1>;
        fontWeight: CSSType.FontWeightProperty;
        color: CSSType.ColorProperty;
    };
};

export type FontStyle = {
    fontFamily: CSSType.FontFamilyProperty;
    fontSize: CSSType.FontSizeProperty<1>;
    fontWeight?: CSSType.FontWeightProperty;
    color?: CSSType.ColorProperty;
    margin?: CSSType.MarginProperty<1>;
    padding?: CSSType.PaddingProperty<1>;
    lineHeight?: CSSType.LineHeightProperty<1>;
    textAlign?: CSSType.TextAlignProperty;
};

export type FontVariants = {
    [key: string]: FontStyle;
};

export type AppTheme = {
    colors: ColorsType;
    fonts: {
        basic: string;
    };
    fontSizes: BasicThemeValue[];
    fontPaddings: FontPaddings;
    fontMargins: FontMargins;
    boxShadows: {
        primary: string;
    };
    radii: Radii;
    sizes: {
        primary: BasicThemeValue;
        secondary: BasicThemeValue;
        tertiary: BasicThemeValue;
        medium: BasicThemeValue;
        large: BasicThemeValue;
    };
    paddings: PaddingsType;
    breakpoints?: Breakpoints;
    mediaQueries?: {
        small: string;
        medium: string;
        large: string;
    };
    buttons?: {
        primary: ButtonPropreties;
        secondary?: ButtonPropreties;
        tertiary?: ButtonPropreties;
        large?: ButtonPropreties;
        logout?: ButtonPropreties;
        login?: ButtonPropreties;
    };
    mobileNavigation: {
        background?: string;
        morePage: {
            background?: string;
        };
    };
    appHeader: {
        boxShadow?: string;
        colors: ColorsType;
    };
    footer: {
        colors: ColorsType;
        fontSizes: BasicThemeValue[];
    };
    modal: {
        dialog: {
            default: ModalType;
        };
        title: {
            default: {
                color?: string;
                fontSize?: string;
                fontWeight?: string;
                lineHeight?: number;
                margin?: string;
                display?: string;
                flexDirection?: string;
                fontFamily?: string;
            };
        };
    };
    table: TableTheme;
    grid: {
        maxWidth: string;
        gap?: string;
    };
};

export type AppThemeProps = {
    theme: AppTheme;
};
