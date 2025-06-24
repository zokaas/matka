
// src/components/WeeklyProgressCard.tsx
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, ProgressBar, Avatar } from 'react-native-paper';
import { WeeklyInsight } from '../types/types';
import { theme } from '../constants/theme';

interface WeeklyProgressCardProps {
  weeklyInsights: WeeklyInsight[];
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({ 
  weeklyInsights 
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return theme.colors.success;
    if (percentage >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  const renderInsight = ({ item }: { item: WeeklyInsight }) => (
    <View style={styles.insightItem}>
      <View style={styles.userInfo}>
        <Avatar.Text
          size={40}
          label={item.username.charAt(0).toUpperCase()}
          style={{ backgroundColor: theme.colors.primary }}
        />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.rank}>#{item.rank}</Text>
        </View>
      </View>
      
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {item.weeklyProgress} / {item.weeklyGoal} km
        </Text>
        <ProgressBar
          progress={item.weeklyPercentage / 100}
          color={getProgressColor(item.weeklyPercentage)}
          style={styles.progressBar}
        />
        <Text style={styles.percentageText}>
          {item.weeklyPercentage}%
        </Text>
        {item.dailyTarget > 0 && (
          <Text style={styles.dailyTarget}>
            {item.dailyTarget} km/päivä tarvitaan
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>📊 Viikon tilanne</Title>
        <FlatList
          data={weeklyInsights}
          renderItem={renderInsight}
          keyExtractor={(item) => item.username}
          showsVerticalScrollIndicator={false}
        />
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
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: theme.spacing.md,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  rank: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  progressInfo: {
    flex: 2,
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    width: 120,
    height: 6,
    borderRadius: 3,
    marginBottom: theme.spacing.xs,
  },
  percentageText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  dailyTarget: {
    fontSize: 10,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
});
