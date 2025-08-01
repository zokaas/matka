export const challengeParams = {
  totalStages: 21,
  totalDistance: 3360,
  startDate: "2025-08-04",
  endDate: "2025-12-19",

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
