export interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
}

export interface User {
  id: string;
  username: string;
  totalKm: number;
  profilePicture?: string;
  activities: Activity[];
}

export interface WeeklyInsight {
  username: string;
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyPercentage: number;
  dailyTarget: number;
  dailyProgress: number;
  dailyPercentage: number;
  rank: number;
}

export interface Quote {
  id: number;
  text: string;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
}

export interface Reaction {
  type: string;
  count: number;
  createdAts?: string[];
}

export interface ReactionResponse {
  added: boolean;
  type: string;
  currentReactions?: { type: string; count: number }[];
}

export interface ActivityWithUser extends Activity {
  username: string;
  profilePicture?: string;
  status?: "coming_soon" | "available";
}

export interface TargetPaces {
  totalProgress: number;
  remainingDistance: number;
  daysRemaining: number;
  dailyPerUser: number;
  weeklyPerUser: number;
  projectedEndDate: Date | null;
  behindAmount?: number;
  expectedProgressToday?: number;
}

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

export interface DailyStats {
  date: string;
  kilometers: number;
  duration: number;
  activities: Activity[];
}

export interface UserStats {
  bestKmDay?: DailyStats;
  longestWorkoutDay?: DailyStats;
  currentStreak: {
    start: string;
    days: number;
  };
}

export interface PointFeature {
  type: "Feature";
  properties: {
    name: string;
    status: string;
    visitDate?: string;
    distanceToNext?: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface LineFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
}

export interface AchievementStats {
  totalDistance: number;
  totalActivities: number;
}