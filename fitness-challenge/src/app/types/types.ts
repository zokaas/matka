export type PointFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { name: string; status: string; visitDate?: string; distanceToNext?: number }
>;

export type LineFeature = GeoJSON.Feature<
  GeoJSON.LineString,
  Record<string, unknown>
>;

// Base Activity type
export type Activity = {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
};

// Base User type
export type BaseUser = {
  profilePicture?: string;
  id: string;
  username: string;
  totalKm: number;
  activities: Activity[];
};

// User type with pagination for user profile page
export interface UserWithPagination extends BaseUser {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Main User type alias - most components should use this
export type User = BaseUser | UserWithPagination;

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
  weeklyPercentage: number;
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
};

export type DailyStats = {
  date: string;
  kilometers: number;
  duration: number;
  activities: Activity[];
};

export type UserStats = {
  bestKmDay?: DailyStats;
  longestWorkoutDay?: DailyStats;
  currentStreak: {
    start: string;
    days: number;
  };
};

export type Comment = {
  id: number;
  text: string;
  createdAt: string;
};

export type Reaction = {
  type: string;
  count: number;
};

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

// Helper type guard to check if a User has pagination
export function hasUserPagination(user: User): user is UserWithPagination {
  return "pagination" in user && user.pagination !== undefined;
}
