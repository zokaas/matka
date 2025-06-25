// src/components/WeeklyProgressBar.tsx - Weekly progress bar like web app
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { User } from '../types/types';
import { theme } from '../constants/theme';

interface WeeklyProgressBarProps {
  users: User[];
}

const CHALLENGE_START_DATE = new Date('2025-01-06');
const CHALLENGE_END_DATE = new Date('2025-06-22');
const TOTAL_CHALLENGE_DISTANCE = 100000;

export const WeeklyProgressBar: React.FC<WeeklyProgressBarProps> = ({ users }) => {
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [weeklyKmPerPerson, setWeeklyKmPerPerson] = useState(0);

  useEffect(() => {
    if (!users || users.length === 0) return;

    // Calculate current week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Calculate weekly goal
    const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingChallengeDistance = Math.max(0, TOTAL_CHALLENGE_DISTANCE - totalProgress);
    const daysRemaining = Math.max(1, Math.ceil((CHALLENGE_END_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const weeksRemaining = Math.ceil(daysRemaining / 7);
    const requiredWeeklyDistance = Math.ceil(remainingChallengeDistance / weeksRemaining);

    setWeeklyGoal(requiredWeeklyDistance);
    setWeeklyKmPerPerson(Math.round(requiredWeeklyDistance / users.length));

    // Calculate current week progress
    let currentWeekDistance = 0;
    users.forEach((user) => {
      const weekActivities = user.activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });

      const userWeeklyDistance = weekActivities.reduce(
        (sum, activity) => sum + activity.kilometers,
        0
      );

      currentWeekDistance += userWeeklyDistance;
    });

    setWeeklyProgress(Math.round(currentWeekDistance));
    setRemainingDistance(Math.max(0, requiredWeeklyDistance - currentWeekDistance));
  }, [users]);

  const progressPercentage = weeklyGoal > 0 ? Math.min(100, (weeklyProgress / weeklyGoal) * 100) : 0;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Viikon tavoite</Text>
        
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {weeklyProgress} / {weeklyGoal} km
          </Text>
          <Text style={styles.percentageText}>
            ({Math.round(progressPercentage)}%)
          </Text>
        </View>

        <ProgressBar
          progress={progressPercentage / 100}
          color={progressPercentage >= 100 ? theme.colors.success : theme.colors.primary}
          style={styles.progressBar}
        />

        <View style={styles.footer}>
          {remainingDistance > 0 ? (
            <Text style={styles.remainingText}>
              <Text style={styles.remainingNumber}>{remainingDistance} km</Text> jäljellä
            </Text>
          ) : (
            <Text style={styles.completedText}>
              Viikkotavoite saavutettu! 🎉
            </Text>
          )}
          <Text style={styles.perPersonText}>
            {weeklyKmPerPerson} km/hlö
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  percentageText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  remainingNumber: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.success,
  },
  perPersonText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
