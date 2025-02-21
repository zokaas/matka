export type PointFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { name: string; status: string; visitDate?: string; distanceToNext?: number }
>;

export type LineFeature = GeoJSON.Feature<
  GeoJSON.LineString,
  Record<string, unknown>
>;


export type Activity = {
  date: string;
  duration: number;
  kilometers: number;
  activity: string;
};

export type User = {
  id: string;
  username: string;
  totalKm: number;
  activities: Activity[];
};

export type AchievementStats = {
  totalDistance: number;
  totalActivities: number;
};

export type TargetPaces = {
  totalProgress: number;
  remainingDistance: number;
  daysRemaining: number;
  dailyPerUser: number;
  weeklyPerUser: number;
  projectedEndDate: Date | null;
};

export type WeeklyInsight = {
  username: string;
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyPercentage: number; // Changed from string to number
  dailyTarget: number;
  dailyProgress: number;
  dailyPercentage: number;
  rank: number;
};

export interface WeeklyData {
  week: number;
  startDate: Date;
  endDate: Date;
  kilometers: number;
  activeDays: number;
  sports: {
    name: string;
    kilometers: number;
    count: number;
  }[];
}
