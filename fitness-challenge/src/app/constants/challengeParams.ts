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