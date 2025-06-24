// src/types/types.ts
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
}
