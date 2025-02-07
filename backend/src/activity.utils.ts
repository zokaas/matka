// Create a new file: activity.utils.ts
export const calculateKilometersWithBonus = (
  activity: string,
  hours: number,
  bonus?: string | null,
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
console.log('Received activity:', activity);

// Strip any numbers and clean up the activity name
const cleanActivity = activity.replace(/^\d+\s*\/\s*/, '').trim();
console.log('Cleaned activity:', cleanActivity);

if (cleanActivity.includes('Muu(100km/h)')) {
  baseKilometers = hours * 100;
} else if (cleanActivity.includes('Muu(50km/h)')) {
  baseKilometers = hours * 50;
} else if (cleanActivity === 'Pyöräily' || cleanActivity === 'Hiihto') {
  baseKilometers = hours > 1 ? 100 + (hours - 1) * 50 : hours * 100;
} else {
  baseKilometers = (basePoints[cleanActivity] ?? 0) * hours;
}

  // Apply Bonus Multiplier
  let finalKilometers = baseKilometers;
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

  console.log('Final Kilometers with Bonus:', finalKilometers);
  return finalKilometers;
};
