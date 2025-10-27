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
  Santeri: 4,
};

// FIXED: Calculate one-time multipliers based on challenge totals
// Total challenge: 3,338.8 km over 19.6 weeks for 10 people
// Each person needs: 3,338.8 / 10 = 333.88 km total
// Each person's total hours: weeklyHours * 19.6 weeks

const CHALLENGE_TOTAL_DISTANCE = 3338.8;
const CHALLENGE_TOTAL_WEEKS = 19.6; // Aug 4 to Dec 19, 2025
const TEAM_SIZE = 10;

// Calculate individual targets and multipliers (FIXED FOR ENTIRE CHALLENGE)
const INDIVIDUAL_TARGET_KM = CHALLENGE_TOTAL_DISTANCE / TEAM_SIZE; // 333.88 km per person

const USER_KM_MULTIPLIERS: { [key: string]: number } = {};

// Calculate each person's fixed multiplier
Object.entries(USER_WEEKLY_HOURS).forEach(([username, weeklyHours]) => {
  const totalHoursForChallenge = weeklyHours * CHALLENGE_TOTAL_WEEKS;
  USER_KM_MULTIPLIERS[username] = INDIVIDUAL_TARGET_KM / totalHoursForChallenge;
});

console.log('🎯 Fixed multipliers for entire challenge:');
Object.entries(USER_KM_MULTIPLIERS).forEach(([username, multiplier]) => {
  console.log(`${username}: ${multiplier.toFixed(2)} km/hour`);
});

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
  Uinti: 2.0,
  Vesijuoksu: 1.0,
  Synnytys: 10,
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
  'Muu(100km/h)': 1.0,
  'Muu(50km/h)': 0.5,
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

  // FIXED: Use pre-calculated fixed multiplier instead of dynamic weekly goal
  const kmMultiplier = USER_KM_MULTIPLIERS[username];

  if (!kmMultiplier) {
    console.warn(
      `⚠️ Username "${username}" not found in USER_KM_MULTIPLIERS, calculation will return 0`,
    );
    return 0;
  }

  // Handle custom activities like "Custom Name / Muu(100km/h)" or "Custom Name / Muu (1x)"
  let activityType = activity.trim();

  if (activity.includes(' / ') && activity.toLowerCase().includes('muu')) {
    const parts = activity.split(' / ');
    const lastPart = parts[parts.length - 1].trim();
    activityType = lastPart;
    console.log('🔧 Detected custom Muu activity, using:', activityType);
  }

  // Try direct lookup first
  let activityWeight = ACTIVITY_WEIGHTS[activityType];

  // Handle fallback Muu formats
  if (activityWeight === undefined) {
    if (activityType.match(/^Muu\(100km\/h\)$/i)) {
      activityWeight = 1.0;
      activityType = 'Muu(100km/h)';
    } else if (activityType.match(/^Muu\(50km\/h\)$/i)) {
      activityWeight = 0.5;
      activityType = 'Muu(50km/h)';
    } else if (activityType.match(/^Muu \(1x\)$/i)) {
      activityWeight = 1.0;
      activityType = 'Muu (1x)';
    } else if (activityType.match(/^Muu \(0\.?5x\)$/i)) {
      activityWeight = 0.5;
      activityType = 'Muu (0.5x)';
    }
  }

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

  // Apply 60min rule to specific activities
  const ONE_HOUR_THEN_HALF_WEIGHT_ACTIVITIES = new Set([
    'Hiihto',
    'Pyöräily',
    'Maantiepyöräily',
    'Gravel',
  ]);

  let effectiveHours: number;

  if (ONE_HOUR_THEN_HALF_WEIGHT_ACTIVITIES.has(activityType)) {
    const firstHour = Math.min(1, hours);
    const remaining = Math.max(0, hours - 1);
    const effort1x = firstHour * 1.0;
    const effort0_5x = remaining * 0.5;
    effectiveHours = effort1x + effort0_5x;

    console.log('⏱️ Applied 60min rule:', {
      firstHour,
      remaining,
      effort1x,
      effort0_5x,
      totalEffortHours: effectiveHours,
    });
  } else {
    effectiveHours = hours * activityWeight;
  }

  // FIXED: Use the pre-calculated fixed multiplier
  const baseKm = effectiveHours * kmMultiplier;

  console.log('🧮 Calculation breakdown:', {
    hours,
    activityWeight,
    effectiveHours,
    kmMultiplier: `${kmMultiplier.toFixed(2)} km/hour (fixed for entire challenge)`,
    baseKm,
  });

  let finalKilometers = baseKm;

  // Bonus multiplier logic
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
