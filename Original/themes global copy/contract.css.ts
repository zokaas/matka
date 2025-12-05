// packages/ui/src/themes/contract.css.ts
import { createThemeContract } from '@vanilla-extract/css';

/**
 * Theme contract - ONLY for values that CHANGE between themes
 * Constants (spacing, sizing, shadows, etc.) are NOT in the contract
 */
export const themeVars = createThemeContract({
  /**
   * Brand Colors - these change per theme
   */
  color: {
    // Primary brand colors
    primary: null,
    primaryContent: null,
    secondary: null,
    secondaryContent: null,
    accent: null,
    accentContent: null,
    
    // Base colors - vary by theme
    baseWhite100: null,
    baseWhite200: null,
    baseWhite300: null,
    baseWhite400: null,
    baseContent: null,
    activeContent: null,
    
    // Semantic colors - can vary by theme
    success: null,
    successContent: null,
    warning: null,
    warningContent: null,
    error: null,
    errorContent: null,
    info: null,
    infoContent: null,
    
    // Component-specific colors
    baseGray100: null,
    baseGray500: null,
    baseNeutral350: null,
    baseGreen400: null,
    baseGreen410: null,
    baseGreen420: null,
    baseGreen500: null,
    
    // Alpha colors
    blackAlpha50: null,
    blackAlpha43: null,
    blackAlpha20: null,
  },
  
  /**
   * Typography - font families change per theme
   */
  font: {
    family: null,
  },
  
  /**
   * Background - images and colors change per theme
   */
  background: {
    image: null,
    color: null,
  },
  
  /**
   * Component-specific theme values
   */
  header: {
    background: null,
  },
  
  steps: {
    badgeBackgroundColor: null,
    badgeBorderColor: null,
    labelColor: null,
    labelActiveColor: null,
    progressLineBackgroundColor: null,
  },
});