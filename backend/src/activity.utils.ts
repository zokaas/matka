// Create a new file: activity.utils.ts
const activityPoints: {
  [key: string]: (hours: number) => number;
} = {
  Juoksu: (hours) => hours * 100,
  Sali: (hours) => hours * 100,
  Tennis: (hours) => hours * 100,
  Pyöräily: (hours) => (hours > 1 ? 100 + (hours - 1) * 50 : hours * 100),
  Hiihto: (hours) => (hours > 1 ? 100 + (hours - 1) * 50 : hours * 100),
  Uinti: (hours) => hours * 200,
  Crossfit: (hours) => hours * 100,
  Tribe: (hours) => hours * 100,
  'Ryhmä, pump': (hours) => hours * 100,
  'Ryhmä, dance': (hours) => hours * 100,
  'Ryhmä, combat': (hours) => hours * 100,
  Spinning: (hours) => hours * 100,
  Squash: (hours) => hours * 100,
  Sulkapallo: (hours) => hours * 100,
  Padel: (hours) => hours * 100,
  Jooga: (hours) => hours * 50,
  Liikkuvuus: (hours) => hours * 50,
  Golf: (hours) => hours * 25,
  'Muu(100km/h)': (hours) => hours * 100,
  'Muu(50km/h)': (hours) => hours * 50,
  'Ryhmä, HIIT': (hours) => hours * 100,
  Kehonpainotreeni: (hours) => hours * 100,
  Jalkapallo: (hours) => hours * 100,
  Jääkiekko: (hours) => hours * 100,
  Kamppailulaji: (hours) => hours * 100,
};

export const calculateKilometersWithBonus = (
  activity: string,
  hours: number,
  bonus?: string | null,
): number => {
  const basePoints =
    activity in activityPoints ? activityPoints[activity](hours) : 0;

  if (!bonus) return basePoints;

  switch (bonus) {
    case 'juhlapäivä':
      return basePoints * 2;
    case 'enemmän kuin kolme urheilee yhdessä':
      return basePoints * 1.5;
    case 'kaikki yhdessä':
      return basePoints * 3;
    default:
      return basePoints;
  }
};
