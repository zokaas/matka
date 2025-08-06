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

const ACTIVITY_WEIGHTS: { [key: string]: number } = {
  Juoksu: 1.0,
  Sali: 1.0,
  Tennis: 1.0,
  Pyöräily: 1.0,
  Hiihto: 1.0,
  Uinti: 2.0,
  Crossfit: 1.0,
  Tribe: 1.0,
  'Ryhmä, pump': 1.0,
  'Ryhmä, dance': 1.0,
  'Ryhmä, combat': 1.0,
  Spinning: 1.0,
  Squash: 1.0,
  Sulkapallo: 1.0,
  Padel: 1.0,
  Jooga: 0.5,
  Liikkuvuus: 0.5,
  Golf: 0.25,
  'Ryhmä, HIIT': 1.0,
  Kehonpainotreeni: 1.0,
  Jalkapallo: 1.0,
  Jääkiekko: 1.0,
  Kamppailulaji: 1.0,
  'Muu(100km/h)': 1.0,
  'Muu(50km/h)': 0.5,
};

export const calculateKilometersWithBonus = (
  activity: string,
  hours: number,
  bonus?: string | null,
  username?: string,
): number => {
  console.log('Calculating Kilometers for:', { activity, hours, bonus });

  const match = activity.match(/Muu\(.*?\)/);
  const activityType = match ? match[0] : activity.trim();

  const activityWeight = ACTIVITY_WEIGHTS[activityType] ?? 0;
  const effortHours = hours * activityWeight;

  const userHours = username ? USER_WEEKLY_HOURS[username] : undefined;
  const kmMultiplier = userHours ? WEEKLY_KM_GOAL / userHours : 0;

  let finalKilometers = effortHours * kmMultiplier;

  switch (bonus) {
    case 'juhlapäivä':
      finalKilometers *= 2;
      break;
    case 'enemmän kuin kolme urheilee yhdessä':
      finalKilometers *= 1.5;
      break;
    case 'kaikki yhdessä':
      finalKilometers *= 3;
      break;
  }

  return finalKilometers;
};
