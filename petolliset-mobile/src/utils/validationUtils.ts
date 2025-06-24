
// src/utils/validationUtils.ts
export const validateActivity = (activity: {
  activity: string;
  duration: string;
  customActivity?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!activity.activity.trim()) {
    errors.push('Valitse laji');
  }
  
  if (!activity.duration.trim()) {
    errors.push('Anna kesto');
  } else {
    const duration = parseInt(activity.duration);
    if (isNaN(duration) || duration <= 0) {
      errors.push('Kesto pitää olla positiivinen numero');
    } else if (duration > 1440) { // 24 hours
      errors.push('Kesto ei voi olla yli 24 tuntia');
    }
  }
  
  const needsCustomName = activity.activity === 'Muu(100km/h)' || activity.activity === 'Muu(50km/h)';
  if (needsCustomName && !activity.customActivity?.trim()) {
    errors.push('Anna lajin nimi');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username.trim()) {
    return { isValid: false, error: 'Käyttäjänimi on pakollinen' };
  }
  
  if (username.length < 2) {
    return { isValid: false, error: 'Käyttäjänimi pitää olla vähintään 2 merkkiä' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Käyttäjänimi ei voi olla yli 20 merkkiä' };
  }
  
  // Basic username validation (letters, numbers, underscore, hyphen)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Käyttäjänimi saa sisältää vain kirjaimia, numeroita, _ ja -' };
  }
  
  return { isValid: true };
};

export const validateQuote = (quote: string): { isValid: boolean; error?: string } => {
  if (!quote.trim()) {
    return { isValid: false, error: 'Sitaatti on pakollinen' };
  }
  
  if (quote.length < 10) {
    return { isValid: false, error: 'Sitaatti pitää olla vähintään 10 merkkiä' };
  }
  
  if (quote.length > 500) {
    return { isValid: false, error: 'Sitaatti ei voi olla yli 500 merkkiä' };
  }
  
  return { isValid: true };
};
