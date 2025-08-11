"use client";
import { useEffect, useState } from 'react';
import { tourDeFranceTheme } from '@/app/themes/tourDeFranceTheme';

const themes = {
  tour: tourDeFranceTheme,
};

export function useTheme() {
  const [themeKey, setThemeKey] = useState<keyof typeof themes>('tour');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored && stored in themes) {
        setThemeKey(stored as keyof typeof themes);
      }
    }
  }, []);

  const theme = themes[themeKey];
  const t = theme.translations;
  const colors = theme.colors;

  return { t, colors, theme };
}