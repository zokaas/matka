// src/utils/formatters.ts
export const formatDate = (dateString: string, locale: string = 'fi-FI'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale);
};

export const formatDateTime = (dateString: string, locale: string = 'fi-FI'): string => {
  const date = new Date(dateString);
  return date.toLocaleString(locale);
};

export const formatNumber = (num: number, locale: string = 'fi-FI'): string => {
  return num.toLocaleString(locale);
};

export const formatKilometers = (km: number, decimals: number = 1): string => {
  return `${km.toFixed(decimals)} km`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Tänään';
  } else if (diffInDays === 1) {
    return 'Eilen';
  } else if (diffInDays < 7) {
    return `${diffInDays} päivää sitten`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} viikko${weeks > 1 ? 'a' : ''} sitten`;
  } else {
    return formatDate(dateString);
  }
};
