// packages/ui/src/themes/metadata.ts

export type ThemeMetadata = {
  id: string;
  name: string;
  fontUrl?: string;
  logoUrl: string;
  faviconUrl?: string;
};

export const themeMetadata: Record<string, ThemeMetadata> = {
  'sweden-b2b-application': {
    id: 'sweden-b2b-application',
    name: 'Sweden B2B Application',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap',
    logoUrl: '/logos/Foretagslan_background.svg',
    faviconUrl: '/favicons/Foretagslan_background.ico',
  },
  
  'finland-b2b-application': {
    id: 'finland-b2b-application',
    name: 'Finland B2B Application',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap',
    logoUrl: '/logos/finland-b2b.svg',
    faviconUrl: '/favicons/finland-b2b.ico',
  },
  
};

export function getThemeMetadata(productId: string): ThemeMetadata {
  const metadata = themeMetadata[productId];
  
  if (!metadata) {
    console.warn(
      `Theme metadata not found for productId: ${productId}, ` +
      `falling back to sweden-b2b-application`
    );
    return themeMetadata['sweden-b2b-application'];
  }
  
  return metadata;
}

export function getAllThemeIds(): string[] {
  return Object.keys(themeMetadata);
}