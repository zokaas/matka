export const calculateKilometersWithBonus = (
  activity: string,
  hours: number,
  bonus?: string | null,
  username?: string,
): number => {
  console.log('Calculating Kilometers for:', { activity, hours, bonus });

  const basePoints: { [key: string]: number } = {
    Juoksu: 100,
    Sali: 100,
    Tennis: 100,
    Uinti: 200,
    Crossfit: 100,
    Tribe: 100,
    'Ryhmä, pump': 100,
    'Ryhmä, dance': 100,
    'Ryhmä, combat': 100,
    Spinning: 100,
    Squash: 100,
    Sulkapallo: 100,
    Padel: 100,
    Jooga: 50,
    Liikkuvuus: 50,
    Golf: 25,
    'Ryhmä, HIIT': 100,
    Kehonpainotreeni: 100,
    Jalkapallo: 100,
    Jääkiekko: 100,
    Kamppailulaji: 100,
    'Muu(100km/h)': 100,
    'Muu(50km/h)': 50,
  };

  let baseKilometers = 0;
  const match = activity.match(/Muu\(.*?\)/);
  const activityType = match ? match[0] : activity.trim();

  if (activityType === 'Muu(100km/h)') {
    baseKilometers = hours * 100;
  } else if (activityType === 'Muu(50km/h)') {
    baseKilometers = hours * 50;
  } else if (activityType === 'Pyöräily' || activityType === 'Hiihto') {
    baseKilometers = hours > 1 ? 100 + (hours - 1) * 50 : hours * 100;
  } else {
    baseKilometers = (basePoints[activityType] ?? 0) * hours;
  }

  const userCoefficient =
    username && USER_COEFFICIENTS[username] !== undefined
      ? USER_COEFFICIENTS[username]
      : 100;

  const normalizedKilometers = baseKilometers * (userCoefficient / 100);

  let finalKilometers = normalizedKilometers;
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

const USER_COEFFICIENTS: { [key: string]: number } = {
  Tyyni: 6.667,
  Tuure: 5.714,
  Tuulia: 5.714,
  Kasper: 5.714,
  Tiia: 5.0,
  Zoka: 5.0,
  Linda: 5.0,
  Oskari: 5.0,
  Leksa: 3.333,
  Santeri: 3.333,
};
