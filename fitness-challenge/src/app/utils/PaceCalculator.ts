import { differenceInDays, parseISO, startOfDay, endOfDay } from 'date-fns';
import { User } from '../types/types';

interface PaceMetrics {
  totalProgress: number;
  remainingDistance: number;
  daysRemaining: number;
  historicalPace: {
    dailyRate: number;
    weeklyRate: number;
    weeklyPerUser: number;
  };
  recentPace: {
    dailyRate: number;
    weeklyRate: number;
    weeklyPerUser: number;
  };
  weeklyPace: {
    dailyRate: number;
    weeklyRate: number;
    weeklyPerUser: number;
  };
  requiredPace: {
    dailyRate: number;
    weeklyRate: number;
    weeklyPerUser: number;
  };
  projectedEndDate: Date | null;
  progressStatus: 'behind' | 'on track' | 'ahead';
}

export class PaceCalculator {
  public static readonly CHALLENGE_START_DATE = new Date('2025-01-06');
  public static readonly CHALLENGE_END_DATE = new Date('2025-06-22');
  private static readonly TOTAL_CHALLENGE_DISTANCE = 100000;

  /**
   * Calculate comprehensive pace metrics with day-specific accuracy
   */
  static calculatePaceMetrics(users: User[], referenceDate: Date = new Date()): PaceMetrics {
    // Validate inputs
    if (!users || users.length === 0) {
      throw new Error('No user data provided');
    }

    // Calculate challenge timeline with precise day handling
    const daysSinceStart = this.calculateDaysSinceStart(referenceDate);
    const daysRemaining = this.calculateDaysRemaining(referenceDate);
    const totalChallengeDays = this.calculateTotalChallengeDays();

    // Total progress
    const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = Math.max(0, this.TOTAL_CHALLENGE_DISTANCE - totalProgress);
    const activeMemberCount = Math.max(1, users.length);

    // Pace calculations with different time windows
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

    // Required pace calculation
    const requiredPace = {
      dailyRate: daysRemaining > 0 
        ? remainingDistance / (daysRemaining * activeMemberCount)
        : 0,
      weeklyRate: daysRemaining > 0 
        ? (remainingDistance / daysRemaining) * 7 
        : 0,
      weeklyPerUser: daysRemaining > 0 
        ? Math.round((remainingDistance / daysRemaining) * 7 / activeMemberCount)
        : 0
    };

    // Projected end date calculation
    const projectedEndDate = this.calculateProjectedEndDate(
      totalProgress, 
      this.TOTAL_CHALLENGE_DISTANCE, 
      this.CHALLENGE_START_DATE, 
      referenceDate
    );

    // Progress status calculation
    const expectedProgressAtThisPoint = 
      (this.TOTAL_CHALLENGE_DISTANCE * daysSinceStart) / totalChallengeDays;
    const progressStatus = this.calculateProgressStatus(
      totalProgress, 
      expectedProgressAtThisPoint
    );

    return {
      totalProgress,
      remainingDistance,
      daysRemaining,
      historicalPace: {
        ...historicalPace,
        weeklyPerUser: Math.round(historicalPace.weeklyRate / activeMemberCount)
      },
      recentPace: {
        ...recentPace,
        weeklyPerUser: Math.round(recentPace.weeklyRate / activeMemberCount)
      },
      weeklyPace: {
        ...weeklyPace,
        weeklyPerUser: Math.round(weeklyPace.weeklyRate / activeMemberCount)
      },
      requiredPace,
      projectedEndDate,
      progressStatus
    };
  }

  /**
   * Calculate pace for a specific time period with precise filtering
   */
  private static calculatePace(
    users: User[], 
    options: { startDate: Date; endDate: Date }
  ): { dailyRate: number; weeklyRate: number } {
    const periodDays = Math.max(1, differenceInDays(options.endDate, options.startDate));

    // Precise activity filtering within the specified date range
    const periodActivities = users.flatMap(user => 
      user.activities.filter(activity => {
        const activityDate = parseISO(activity.date);
        return activityDate >= startOfDay(options.startDate) && 
               activityDate <= endOfDay(options.endDate);
      })
    );

    const totalKm = periodActivities.reduce((sum, activity) => sum + activity.kilometers, 0);

    return {
      dailyRate: totalKm / periodDays,
      weeklyRate: (totalKm / periodDays) * 7
    };
  }

  /**
   * Get start date for recent pace calculation (last 28 days)
   */
  private static getRecentStartDate(referenceDate: Date): Date {
    const recentStartDate = new Date(referenceDate);
    recentStartDate.setDate(referenceDate.getDate() - 28);
    return recentStartDate;
  }

  /**
   * Get start date for weekly pace calculation (last 7 days)
   */
  private static getWeeklyStartDate(referenceDate: Date): Date {
    const weeklyStartDate = new Date(referenceDate);
    weeklyStartDate.setDate(referenceDate.getDate() - 7);
    return weeklyStartDate;
  }

  /**
   * Calculate days since challenge start
   */
  private static calculateDaysSinceStart(referenceDate: Date): number {
    return Math.max(1, differenceInDays(referenceDate, this.CHALLENGE_START_DATE));
  }

  /**
   * Calculate days remaining in the challenge
   */
  private static calculateDaysRemaining(referenceDate: Date): number {
    return Math.max(0, Math.ceil(
      (this.CHALLENGE_END_DATE.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
  }

  /**
   * Calculate total challenge days
   */
  private static calculateTotalChallengeDays(): number {
    return Math.ceil(
      (this.CHALLENGE_END_DATE.getTime() - this.CHALLENGE_START_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  /**
   * Calculate projected end date based on current progress
   */
  private static calculateProjectedEndDate(
    currentProgress: number, 
    totalDistance: number, 
    startDate: Date, 
    referenceDate: Date
  ): Date | null {
    const daysSinceStart = Math.max(1, differenceInDays(referenceDate, startDate));
    const currentDailyRate = currentProgress / daysSinceStart;

    if (currentDailyRate <= 0) return null;

    const remainingDistance = totalDistance - currentProgress;
    const daysNeeded = remainingDistance / currentDailyRate;

    const projectedEndDate = new Date(referenceDate);
    projectedEndDate.setDate(projectedEndDate.getDate() + Math.ceil(daysNeeded));

    return projectedEndDate;
  }

  /**
   * Calculate progress status
   */
  private static calculateProgressStatus(
    actualProgress: number, 
    expectedProgress: number
  ): 'behind' | 'on track' | 'ahead' {
    const BEHIND_THRESHOLD = 0.95;
    const AHEAD_THRESHOLD = 1.05;

    const progressRatio = actualProgress / expectedProgress;

    if (progressRatio < BEHIND_THRESHOLD) return 'behind';
    if (progressRatio > AHEAD_THRESHOLD) return 'ahead';
    return 'on track';
  }
}