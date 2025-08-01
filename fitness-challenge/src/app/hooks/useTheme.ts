import { useState } from 'react';
import { themes } from '@/app/themes/themeManager';

export const useTheme = () => {
  const [selectedTheme] = useState(
    localStorage.getItem('selectedTheme') || 'tour'
  );
  
  const currentTheme = themes[selectedTheme as keyof typeof themes];
  const { translations: t } = currentTheme;

  return {
    theme: currentTheme,
    t,
    selectedTheme
  };
};