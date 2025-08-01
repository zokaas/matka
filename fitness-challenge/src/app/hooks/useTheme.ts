import { useMemo } from 'react';
import { tourDeFranceTheme } from '@/app/themes/tourDeFranceTheme';

const themes = {
  tour: tourDeFranceTheme,
};

export function useTheme() {
  const selectedThemeKey = localStorage.getItem('theme') || 'tour';
  const theme = themes[selectedThemeKey as keyof typeof themes] || tourDeFranceTheme;

  const t = theme.translations;
  const colors = theme.colors;

  return { t, colors, theme }; 
}
