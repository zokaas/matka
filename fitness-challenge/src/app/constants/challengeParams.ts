export const challengeParams = {
  totalStages: 21,
  totalDistance: 3338.8, // Updated to match actual 2025 TDF distance
  startDate: "2025-08-04", // TDF 2025 start date
  endDate: "2025-12-19", // TDF 2025 end date

  get totalDays() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  },

  get dailyTarget() {
    return Number((this.totalDistance / this.totalDays).toFixed(2));
  },

  get weeklyTarget() {
    return Number((this.totalDistance / (this.totalDays / 7)).toFixed(2));
  }
};

export const USER_WEEKLY_HOURS: Record<string, number> = {
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

export const ACTIVITY_WEIGHTS: Record<string, number> = {
  Juoksu: 1.0,
  Sali: 1.0,
  Tennis: 1.0,
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