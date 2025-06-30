// src/components/PopularSports.tsx - Popular sports component
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Title, List } from 'react-native-paper';
import { User } from '../types/types';
import { theme } from '../constants/theme';

interface PopularSportsProps {
  users: User[];
}

export const PopularSports: React.FC<PopularSportsProps> = ({ users }) => {
  const sportCounts = users
    .flatMap(user => user.activities)
    .reduce((acc, activity) => {
      acc[activity.activity] = (acc[activity.activity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topSports = Object.entries(sportCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Suosituimmat lajit</Title>
          {topSports.map(([sport, count], index) => (
            <List.Item
              key={sport}
              title={sport}
              description={`${count} suoritusta`}
              left={() => (
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
              )}
              style={styles.listItem}
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
    paddingVertical: theme.spacing.xs,
  },
  rankBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
