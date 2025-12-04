// packages/ui/src/themes/base-tokens.ts

/**
 * Base design tokens shared across ALL themes
 * These values ensure consistency in spacing, sizing, etc.
 */
export const baseTokens = {
  spacing: {
    defaultPadding: '0.25rem',
    tinyPadding: '0.5rem',
    smallPadding: '1rem',
    basicPadding: '1.5rem',
    largePadding: '2rem',
  },
  
  size: {
    xs: '0.5rem',      // 8px
    s: '1rem',         // 16px
    m: '1.5rem',       // 24px
    l: '2rem',         // 32px
    xl: '2.5rem',      // 40px
    xxl: '3rem',       // 48px
    xxxl: '3.5rem',    // 56px
    huge: '4rem',      // 64px
  },
  
  radius: {
    sm: '0.125rem',    // 2px
    md: '0.25rem',     // 4px
    lg: '0.5rem',      // 8px
    xl: '1rem',        // 16px
  },
  
  fontSize: {
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    xxl: '1.5rem',     // 24px
    xxxl: '1.875rem',  // 30px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  width: {
    full: '100%',
    containerSm: '24rem',
    containerMd: '28rem',
    containerLg: '32rem',
    containerXl: '36rem',
    container2xl: '42rem',
    container6xl: '72rem',
  },
  
  header: {
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    minHeight: '76px',
    position: 'relative' as const,
    width: '100%',
    zIndex: '10',
  },
} as const;