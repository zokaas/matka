// src/constants/theme.ts
export const theme = {
  colors: {
    primary: '#c4a7e7',       // pastel purple
    primaryLight: '#e1ccf7',  // soft lavender
    primaryDark: '#a88fd0',   // dusty violet

    secondary: '#99d9ea',     // pastel turquoise

    background: '#fdf6f0',    // very light peach
    surface: '#ffffff',       // clean white card

    error: '#f8b4b4',         // soft rose
    success: '#a7f3d0',       // pastel mint
    warning: '#fde68a',       // soft yellow

    text: '#374151',          // muted dark gray
    textSecondary: '#9ca3af', // soft gray

    border: '#e5e7eb',        // light neutral border
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
    },
  },
};