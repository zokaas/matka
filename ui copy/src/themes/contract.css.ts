// packages/ui/src/themes/contract.css.ts
import { createThemeContract } from '@vanilla-extract/css';

// Named "vars" as you requested!
export const vars = createThemeContract({
  color: {

    primary: null,
    primaryContent: null,
    secondary: null,
    secondaryContent: null,
    accent: null,
    accentContent: null,
    

    baseWhite100: null,
    baseWhite200: null,
    baseWhite300: null,
    baseWhite400: null,
    baseContent: null,
    activeContent: null,
    

    success: null,
    successContent: null,
    warning: null,
    warningContent: null,
    error: null,
    errorContent: null,
    info: null,
    infoContent: null,
    
    baseGray100: null,
    baseGray500: null,
    baseNeutral350: null,
    baseGreen400: null,
    baseGreen410: null,
    baseGreen420: null,
    baseGreen500: null,
    

    blackAlpha50: null,
    blackAlpha43: null,
    blackAlpha20: null,
  },
  
  font: {
    family: null,
  },
  
  background: {
    image: null,
    color: null,
  },
  
  spacing: {
    defaultPadding: null,
    tinyPadding: null,
    smallPadding: null,
    basicPadding: null,
    largePadding: null,
  },
  
  size: {
    xs: null,
    s: null,
    m: null,
    l: null,
    xl: null,
    xxl: null,
    xxxl: null,
    huge: null,
  },
  
  radius: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  
  fontSize: {
    sm: null,
    base: null,
    lg: null,
    xl: null,
    xxl: null,
    xxxl: null,
  },
  
  fontWeight: {
    normal: null,
    medium: null,
    semiBold: null,
    bold: null,
  },
  
  lineHeight: {
    tight: null,
    normal: null,
    relaxed: null,
  },
  
  width: {
    full: null,
    containerSm: null,
    containerMd: null,
    containerLg: null,
    containerXl: null,
    container2xl: null,
    container6xl: null,
  },
  
  header: {
    backgroundColor: null,
    boxShadow: null,
    minHeight: null,
    position: null,
    width: null,
    zIndex: null,
  },
  
  steps: {
    badgeBackgroundColor: null,
    badgeBorderColor: null,
    labelColor: null,
    labelFontSize: null,
    labelMarginTop: null,
    labelActiveColor: null,
    progressLineBackgroundColor: null,
  },
});