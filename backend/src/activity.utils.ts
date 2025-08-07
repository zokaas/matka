const USER_WEEKLY_HOURS: { [key: string]: number } = {
  Tyyni: 3,
  Tuure: 3.5,
  Tuulia: 3.5,
  Kasper: 3.5,
  Tiia: 4,
  Zoka: 4,
  Linda: 4,
  Oskari: 4,
  Leksa: 6,
  Santeri: 6,
};

const WEEKLY_KM_GOAL = 16.935;

export const ACTIVITY_WEIGHTS: { [key: string]: number } = {
  // Suosituimmat
  Juoksu: 1.0,
  Pyöräily: 1.0,
  Maantiepyöräily: 1.0,
  Gravel: 1.0,
  Sali: 1.0,
  Tennis: 1.0,

  // Ryhmäliikunta & toiminnallinen treeni
  'Ryhmä, pump': 1.0,
  'Ryhmä, dance': 1.0,
  'Ryhmä, combat': 1.0,
  'Ryhmä, HIIT': 1.0,
  Tribe: 1.0,
  Spinning: 1.0,
  Crossfit: 1.0,
  Kehonpainotreeni: 1.0,

  // Kuntoilulajit ja kamppailu
  Hiihto: 1.0,
  Uinti: 1.5,
  Jalkapallo: 1.0,
  Jääkiekko: 1.0,
  Kamppailulaji: 1.0,
  Kiipeily: 0.75,

  // Mailapelit ja pallopelit
  Padel: 1.0,
  Sulkapallo: 1.0,
  Squash: 1.0,
  Beachvolley: 1.0,

  // Kehonhuolto ja kevyemmät lajit
  Jooga: 0.5,
  'Liikkuvuus / Kehonhuolto': 0.5,
  'Laitepilates / Megaformer': 1.0,

  // Matalatehoiset ja vapaa-ajan aktiviteetit
  Golf: 0.25,
  'Frisbee golf': 0.5,

  // Muu - Support both old and new formats
  'Muu (1x)': 1.0,
  'Muu (0.5x)': 0.5,
  'Muu(100km/h)': 1.0, // ✅ Add support for old format
  'Muu(50km/h)': 0.5, // ✅ Add support for old format
};

export const calculateKilometersWithBonus = (
  activity: string,
  hours: number,
  bonus?: string | null,
  username?: string,
): number => {
  console.log('🔍 Calculating Kilometers for:', {
    activity,
    hours,
    bonus,
    username,
  });

  if (!username) {
    console.warn('⚠️ No username provided, calculation will return 0');
    return 0;
  }

  if (!USER_WEEKLY_HOURS[username]) {
    console.warn(
      `⚠️ Username "${username}" not found in USER_WEEKLY_HOURS, calculation will return 0`,
    );
    return 0;
  }

  // Handle custom activities like "Custom Name / Muu(100km/h)" or "Custom Name / Muu (1x)"
  let activityType = activity.trim();

  // Check if it's a custom activity with " / " separator
  if (activity.includes(' / ')) {
    const parts = activity.split(' / ');
    const lastPart = parts[parts.length - 1].trim();

    // Use the last part (should be the activity type)
    activityType = lastPart;
  }

  // Try direct lookup first
  let activityWeight = ACTIVITY_WEIGHTS[activityType];

  // If not found, try to match Muu patterns
  if (activityWeight === undefined) {
    // Handle old format: Muu(100km/h) or Muu(50km/h)
    if (activityType.match(/^Muu\(100km\/h\)$/i)) {
      activityWeight = 1.0;
      activityType = 'Muu(100km/h)';
    } else if (activityType.match(/^Muu\(50km\/h\)$/i)) {
      activityWeight = 0.5;
      activityType = 'Muu(50km/h)';
    }
    // Handle new format: Muu (1x) or Muu (0.5x)
    else if (activityType.match(/^Muu \(1x\)$/i)) {
      activityWeight = 1.0;
      activityType = 'Muu (1x)';
    } else if (activityType.match(/^Muu \(0\.?5x\)$/i)) {
      activityWeight = 0.5;
      activityType = 'Muu (0.5x)';
    }
  }

  // Default to 1.0 if still not found
  if (activityWeight === undefined) {
    console.warn(
      `⚠️ Activity type "${activityType}" not found in ACTIVITY_WEIGHTS, using default 1.0`,
    );
    activityWeight = 1.0;
  }

  console.log('📊 Activity details:', {
    originalActivity: activity,
    resolvedActivityType: activityType,
    activityWeight,
  });

  const effortHours = hours * activityWeight;
  const userHours = USER_WEEKLY_HOURS[username];
  const kmMultiplier = userHours ? WEEKLY_KM_GOAL / userHours : 0;

  console.log('🧮 Calculation breakdown:', {
    hours,
    activityWeight,
    effortHours,
    userHours,
    kmMultiplier,
    baseKm: effortHours * kmMultiplier,
  });

  let finalKilometers = effortHours * kmMultiplier;

  // Apply bonus multipliers
  switch (bonus) {
    case 'juhlapäivä':
      finalKilometers *= 2;
      console.log('🎉 Applied holiday bonus (2x)');
      break;
    case 'enemmän kuin kolme urheilee yhdessä':
      finalKilometers *= 1.5;
      console.log('👥 Applied group bonus (1.5x)');
      break;
    case 'kaikki yhdessä':
      finalKilometers *= 3;
      console.log('🏔️ Applied everyone together bonus (3x)');
      break;
  }

  console.log('✅ Final result:', finalKilometers);
  return finalKilometers;
};
