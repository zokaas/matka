// src/components/TopPerformers.tsx - Top performers component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, List, Avatar } from 'react-native-paper';
import { WeeklyInsight } from '../types/types';
import { theme } from '../constants/theme';

interface TopPerformersProps {
  weeklyInsights: WeeklyInsight[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ weeklyInsights }) => {
  const topPerformers = weeklyInsights
    .sort((a, b) => b.weeklyProgress - a.weeklyProgress)
    .slice(0, 5);

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Viikon Top Suorittajat</Title>
          {topPerformers.map((user, index) => (
            <List.Item
              key={user.username}
              title={user.username}
              description={`${user.weeklyProgress} km tällä viikolla`}
              left={() => (
                <Avatar.Text
                  size={40}
                  label={getMedal(index)}
                  style={[
                    styles.avatar,
                    index < 3 && styles.medalAvatar
                  ]}
                />
              )}
              style={[
                styles.listItem,
                index < 3 && styles.topThree
              ]}
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  listItem: {
    paddingVertical: theme.spacing.sm,
  },
  topThree: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  avatar: {
    backgroundColor: theme.colors.textSecondary,
  },
  medalAvatar: {
    backgroundColor: theme.colors.primary,
  },
});