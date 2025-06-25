// src/utils/activityUtils.ts - Complete version matching web app
import { Activity, User } from '../types/types';
import { getCurrentWeek, isDateInRange } from './dateUtils';

// This matches the web app's calculation logic exactly
export const calculateKilometersWithBonus = (
  activity: string,
  hours: number,
  bonus?: string | null
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

  // Extract the base activity type if it's a custom "Muu"
  const match = activity.match(/Muu\(.*?\)/);
  const activityType = match ? match[0] : activity.trim();

  if (activityType === 'Muu(100km/h)') {
    baseKilometers = hours * 100;
  } else if (activityType === 'Muu(50km/h)') {
    baseKilometers = hours * 50;
  } else if (activityType === 'Pyöräily' || activityType === 'Hiihto') {
    baseKilometers = hours > 1 ? 100 + (hours - 1) * 50 : hours * 100;
  } else {
    baseKilometers = (basePoints[activityType] ?? 0) * hours;
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

// Helper function to get the start and end of the current week
const getCurrentWeekRange = () => {
  const today = new Date();

  // Calculate Monday
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const monday = new Date(today);
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days; otherwise, dayOfWeek - 1
  monday.setDate(today.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0); // Set to start of the day

  // Calculate Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999); // Set to end of the day

  return { monday, sunday };
};

// Get Week's Most Popular Sport
export const getWeekTopSports = (users: User[]) => {
  const { monday, sunday } = getCurrentWeekRange();

  // Filter activities within the current week
  const weekActivities = users.flatMap((user) =>
    user.activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate >= monday && activityDate <= sunday;
    })
  );

  // Count occurrences of each sport
  const sportCounts = weekActivities.reduce<Record<string, number>>((acc, activity) => {
    acc[activity.activity] = (acc[activity.activity] || 0) + 1;
    return acc;
  }, {});

  if (Object.keys(sportCounts).length === 0) return null;

  // Determine the sport(s) with the highest count
  const maxCount = Math.max(...Object.values(sportCounts));
  const topSports = Object.entries(sportCounts)
    .filter(([, count]) => count === maxCount)
    .map(([sport]) => ({ name: sport, count: maxCount }));

  return { count: maxCount, sports: topSports };
};

// Get Longest Activities
export const getLongestActivities = (users: User[]) => {
  const { monday, sunday } = getCurrentWeekRange();

  const recentActivities = users.flatMap((user) =>
    user.activities
      .filter((a) => {
        const activityDate = new Date(a.date);
        return activityDate >= monday && activityDate <= sunday;
      })
      .map((a) => ({ ...a, username: user.username }))
  );

  if (recentActivities.length === 0) return [];

  const maxKilometers = Math.max(...recentActivities.map((a) => a.kilometers));

  return recentActivities.filter((a) => a.kilometers === maxKilometers);
};

// Get Weekly Top Performers
export const getWeeklyTopPerformers = (users: User[]) => {
  const { monday, sunday } = getCurrentWeekRange();

  const weeklyStats = users.map((user) => {
    const weeklyKm = user.activities
      .filter((a) => {
        const activityDate = new Date(a.date);
        return activityDate >= monday && activityDate <= sunday;
      })
      .reduce((sum, a) => sum + a.kilometers, 0);

    return { username: user.username, kilometers: weeklyKm };
  });

  if (weeklyStats.length === 0) return null;

  const maxKm = Math.max(...weeklyStats.map((stat) => stat.kilometers));
  const topPerformers = weeklyStats
    .filter((stat) => stat.kilometers === maxKm)
    .sort((a, b) => a.username.localeCompare(b.username));

  return { kilometers: maxKm, users: topPerformers };
};

export const getWeeklyActivities = (activities: Activity[]): Activity[] => {
  const { weekStart, weekEnd } = getCurrentWeek();
  
  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return isDateInRange(activityDate, weekStart, weekEnd);
  });
};

export const getActivitiesByDateRange = (
  activities: Activity[], 
  startDate: Date, 
  endDate: Date
): Activity[] => {
  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return isDateInRange(activityDate, startDate, endDate);
  });
};

export const getTotalKilometers = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => total + activity.kilometers, 0);
};

export const getTotalDuration = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => total + activity.duration, 0);
};

export const getMostPopularActivity = (activities: Activity[]): string | null => {
  if (activities.length === 0) return null;
  
  const activityCounts = activities.reduce((counts, activity) => {
    counts[activity.activity] = (counts[activity.activity] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  return Object.entries(activityCounts)
    .sort(([, a], [, b]) => b - a)[0][0];
};

export const getActivityStreak = (activities: Activity[]): number => {
  if (activities.length === 0) return 0;
  
  // Group activities by date to handle multiple activities on the same day
  const activityDates = activities
    .map(activity => new Date(activity.date).toISOString().split('T')[0])
    .filter((date, index, self) => self.indexOf(date) === index) // Remove duplicates
    .sort(); // Ensure dates are sorted ascending (oldest first)

  // Calculate streaks properly
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Loop through the unique dates
  for (let i = 0; i < activityDates.length; i++) {
    const currentDate = new Date(activityDates[i]);
    
    if (i === 0) {
      // First activity starts a streak
      tempStreak = 1;
    } else {
      const prevDate = new Date(activityDates[i-1]);
      const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day, continue streak
        tempStreak++;
      } else {
        // Gap detected, reset streak
        tempStreak = 1;
      }
    }
    
    // Update longest streak if current one is longer
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Calculate current streak (check if the most recent activity was today or yesterday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Only calculate current streak if there are any activity dates
  if (activityDates.length > 0) {
    // Need to get the most recent activity date
    const mostRecentActivityDate = new Date(activityDates[activityDates.length - 1]);
    mostRecentActivityDate.setHours(0, 0, 0, 0);

    // Check if the most recent activity was today or yesterday
    if (mostRecentActivityDate.getTime() === today.getTime() || 
        mostRecentActivityDate.getTime() === yesterday.getTime()) {
      // If so, count back from the most recent date to find the current streak
      currentStreak = 1;
      for (let i = activityDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(activityDates[i]);
        const nextDate = new Date(activityDates[i + 1]);
        const dayDiff = Math.round((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          break; // Streak is broken
        }
      }
    } else {
      // Most recent activity is older than yesterday, so no current streak
      currentStreak = 0;
    }
  }

  return currentStreak;
};