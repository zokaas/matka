export type PointFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { name: string; status: string; visitDate?: string; distanceToNext?: number }
>;

export type LineFeature = GeoJSON.Feature<
  GeoJSON.LineString,
  Record<string, unknown>
>;


export type Activity = {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
};

export type User = {
  profilePicture?: string;
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

export type WeeklyData = {
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


export type DailyStats = {
  date: string;
  kilometers: number;
  duration: number;
  activities: Activity[];
}

export type UserStats = {
  bestKmDay?: DailyStats;
  longestWorkoutDay?: DailyStats;
  currentStreak: {
    start: string;
    days: number;
  };
}

export type Comment = {
  id: number;
  text: string;
  createdAt: string;
};

export type Reaction = {
  type: string;
  count: number;
}


export type ActivityWithUser = Activity & {
  username: string;
  profilePicture?: string;
  status?: "coming_soon" | "available";
};

// Quote type definition
export type Quote = {
  id: number;
  text: string;
};

