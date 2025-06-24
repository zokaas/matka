
// src/utils/activityUtils.ts
import { Activity, User } from '../types/types';
import { getCurrentWeek, isDateInRange } from './dateUtils';

export const calculateKilometersWithBonus = (
  activity: string,
  hours: number,
  bonus?: string | null
): number => {
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

  return finalKilometers;
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
  
  const sortedActivities = activities
    .map(activity => new Date(activity.date).toISOString().split('T')[0])
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort();
  
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < sortedActivities.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const currentDate = new Date(sortedActivities[i]);
      const prevDate = new Date(sortedActivities[i - 1]);
      const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
  }
  
  // Calculate current streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (sortedActivities.length > 0) {
    const mostRecentDate = new Date(sortedActivities[sortedActivities.length - 1]);
    mostRecentDate.setHours(0, 0, 0, 0);
    
    if (mostRecentDate.getTime() === today.getTime() || 
        mostRecentDate.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      for (let i = sortedActivities.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedActivities[i]);
        const nextDate = new Date(sortedActivities[i + 1]);
        const dayDiff = Math.round((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }
  
  return currentStreak;
};
