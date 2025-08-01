// utils/PaceCalculator.ts
import { differenceInDays, parseISO, startOfDay, endOfDay } from 'date-fns';
import { User } from '../types/types';
import { challengeParams } from '../constants/challengeParams';

interface PaceMetrics {
  totalProgress: number;
  remainingDistance: number;
  daysRemaining: number;
  historicalPace: { dailyRate: number; weeklyRate: number; weeklyPerUser: number };
  recentPace: { dailyRate: number; weeklyRate: number; weeklyPerUser: number };
  weeklyPace: { dailyRate: number; weeklyRate: number; weeklyPerUser: number };
  requiredPace: { dailyRate: number; weeklyRate: number; weeklyPerUser: number };
  projectedEndDate: Date | null;
  progressStatus: 'behind' | 'on track' | 'ahead';
  behindAmount: number;
  expectedProgressToday: number;
  projections: {
    historical: { estimatedEndDate: Date | null; daysFromTarget: number | null };
    recent: { estimatedEndDate: Date | null; daysFromTarget: number | null };
    weekly: { estimatedEndDate: Date | null; daysFromTarget: number | null };
  };
}

export class PaceCalculator {
public static readonly CHALLENGE_START_DATE = new Date(challengeParams.startDate);
public static readonly CHALLENGE_END_DATE = new Date(challengeParams.endDate);
private static readonly TOTAL_CHALLENGE_DISTANCE = challengeParams.totalDistance;


  static calculatePaceMetrics(users: User[], referenceDate: Date = new Date()): PaceMetrics {
    if (!users || users.length === 0) throw new Error('No user data provided');

    const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = Math.max(0, this.TOTAL_CHALLENGE_DISTANCE - totalProgress);
    const activeMemberCount = Math.max(1, users.length);
    const totalChallengeDistance = this.TOTAL_CHALLENGE_DISTANCE;

    const daysSinceStart = Math.max(1, differenceInDays(referenceDate, this.CHALLENGE_START_DATE));
    const daysRemaining = Math.max(0, Math.ceil((this.CHALLENGE_END_DATE.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalChallengeDays = Math.ceil((this.CHALLENGE_END_DATE.getTime() - this.CHALLENGE_START_DATE.getTime()) / (1000 * 60 * 60 * 24));
    
    // How much the team should have completed by today
    const expectedProgressToday = totalChallengeDays > 0 
      ? (totalChallengeDistance * daysSinceStart) / totalChallengeDays
      : 0;

    // How much the team is behind
    const behindAmount = expectedProgressToday > totalProgress
      ? Math.round(expectedProgressToday - totalProgress)
      : 0;
      
    const historicalPace = this.calculatePace(users, {
      startDate: this.CHALLENGE_START_DATE,
      endDate: referenceDate
    });

    const recentPace = this.calculatePace(users, {
      startDate: this.getRecentStartDate(referenceDate),
      endDate: referenceDate
    });

    const weeklyPace = this.calculatePace(users, {
      startDate: this.getWeeklyStartDate(referenceDate),
      endDate: referenceDate
    });

    const requiredPace = {
      dailyRate: daysRemaining > 0 ? remainingDistance / (daysRemaining * activeMemberCount) : 0,
      weeklyRate: daysRemaining > 0 ? (remainingDistance / daysRemaining) * 7 : 0,
      weeklyPerUser: daysRemaining > 0 ? Math.round((remainingDistance / daysRemaining) * 7 / activeMemberCount) : 0
    };

    const projectedEndDate = this.calculateProjectedEndDate(totalProgress, this.TOTAL_CHALLENGE_DISTANCE, this.CHALLENGE_START_DATE, referenceDate);

    const progressStatus = this.calculateProgressStatus(
      totalProgress,
      (this.TOTAL_CHALLENGE_DISTANCE * daysSinceStart) / totalChallengeDays
    );

    const projectedEndDateFrom = (teamWeeklyRate: number): Date | null => {
      if (teamWeeklyRate <= 0) return null;
    
      // Convert weekly pace to daily pace
      const dailyRate = teamWeeklyRate / 7;
      
      // Calculate days needed
      const daysNeeded = remainingDistance / dailyRate;
      
      const result = new Date(referenceDate);
      result.setDate(result.getDate() + Math.ceil(daysNeeded));
      return result;
    };
     
    const projections = {
      historical: {
        estimatedEndDate: projectedEndDateFrom(historicalPace.weeklyRate),
        daysFromTarget: null as number | null,
      },
      recent: {
        estimatedEndDate: projectedEndDateFrom(recentPace.weeklyRate),
        daysFromTarget: null as number | null,
      },
      weekly: {
        estimatedEndDate: projectedEndDateFrom(weeklyPace.weeklyRate),
        daysFromTarget: null as number | null,
      },
    };
    
    // Calculate daysFromTarget for each projection
    for (const key of Object.keys(projections)) {
      const item = projections[key as keyof typeof projections];
    
      if (item.estimatedEndDate) {
        projections[key as keyof typeof projections] = {
          ...item,
          daysFromTarget: Math.ceil(
            (item.estimatedEndDate.getTime() - this.CHALLENGE_END_DATE.getTime()) / (1000 * 60 * 60 * 24)
          ),
        };
      }
    }
    
    return {
      totalProgress,
      remainingDistance,
      daysRemaining,
      historicalPace: {
        ...historicalPace,
        weeklyPerUser: Math.round(historicalPace.weeklyRate / activeMemberCount),
      },
      recentPace: {
        ...recentPace,
        weeklyPerUser: Math.round(recentPace.weeklyRate / activeMemberCount),
      },
      weeklyPace: {
        ...weeklyPace,
        weeklyPerUser: Math.round(weeklyPace.weeklyRate / activeMemberCount),
      },
      requiredPace,
      projectedEndDate,
      progressStatus,
      projections,
      behindAmount,
      expectedProgressToday,
    };
  }

  private static calculatePace(users: User[], options: { startDate: Date; endDate: Date }) {
    const periodDays = Math.max(1, differenceInDays(options.endDate, options.startDate));
    const activities = users.flatMap(user =>
      user.activities.filter(a => {
        const date = parseISO(a.date);
        return date >= startOfDay(options.startDate) && date <= endOfDay(options.endDate);
      })
    );
    const totalKm = activities.reduce((sum, a) => sum + a.kilometers, 0);

    return {
      dailyRate: totalKm / periodDays,
      weeklyRate: (totalKm / periodDays) * 7
    };
  }

  private static getRecentStartDate(date: Date) {
    const d = new Date(date);
    d.setDate(date.getDate() - 28);
    return d;
  }

  private static getWeeklyStartDate(date: Date) {
    const d = new Date(date);
    d.setDate(date.getDate() - 7);
    return d;
  }

  private static calculateProjectedEndDate(currentProgress: number, total: number, start: Date, reference: Date) {
    const daysSince = Math.max(1, differenceInDays(reference, start));
    const rate = currentProgress / daysSince;
    if (rate <= 0) return null;

    const daysNeeded = (total - currentProgress) / rate;
    const projected = new Date(reference);
    projected.setDate(projected.getDate() + Math.ceil(daysNeeded));
    return projected;
  }

  private static calculateProgressStatus(actual: number, expected: number): 'behind' | 'on track' | 'ahead' {
    const ratio = actual / expected;
    if (ratio < 0.95) return 'behind';
    if (ratio > 1.05) return 'ahead';
    return 'on track';
  }
}