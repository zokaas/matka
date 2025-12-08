// packages/ui/src/themes/contract.css.ts
import { createThemeContract } from '@vanilla-extract/css';

/**
 * Theme contract - ONLY for values that CHANGE between themes
 * Constants (spacing, sizing, shadows, etc.) are NOT in the contract
 */
export const themeVars = createThemeContract({
  /**
   * Base Colors - vary by theme
   */
  color: {
    // Base colors
    baseBlue100: null,
    baseWhite100: null,
    baseWhite200: null,
    baseWhite400: null,
    baseWhite400: null,
    baseContent: null,
    activeContent: null,
    
    // Gray scale
    baseGray100: null,
    baseGray500: null,
    baseNeutral350: null,
    
    // Green scale
    baseGreen400: null,
    baseGreen410: null,
    baseGreen420: null,
    baseGreen500: null,
    
    // Alpha colors
    blackAlpha50: null,
    blackAlpha43: null,
    blackAlpha20: null,
    
    // Semantic colors (if needed in future)
    primary: null,
    primaryContent: null,
    success: null,
    warning: null,
    error: null,
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
    backgroundColor: null,
    boxShadow: null,
  },
  
  steps: {
    badgeBackgroundColor: null,
    badgeBorderColor: null,
    labelColor: null,
    labelActiveColor: null,
    progressLineBackgroundColor: null,
  },
});