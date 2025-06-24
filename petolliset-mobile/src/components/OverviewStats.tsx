// src/components/OverviewStats.tsx - Weekly insights overview
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { User } from '../types/types';
import { theme } from '../constants/theme';

interface OverviewStatsProps {
  users: User[];
  totalKm: number;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ users, totalKm }) => {
  const totalActivities = users.reduce((sum, user) => sum + user.activities.length, 0);
  const averageKmPerUser = users.length > 0 ? totalKm / users.length : 0;
  const targetKm = 100000;
  const progressPercentage = (totalKm / targetKm) * 100;
  const remainingKm = Math.max(0, targetKm - totalKm);

  const today = new Date();
  const challengeEnd = new Date('2025-06-22');
  const daysRemaining = Math.ceil((challengeEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Yleiskatsaus</Title>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(totalKm).toLocaleString('fi-FI')}</Text>
              <Text style={styles.statLabel}>Kilometriä yhteensä</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalActivities}</Text>
              <Text style={styles.statLabel}>Suorituksia</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(averageKmPerUser)}</Text>
              <Text style={styles.statLabel}>km / henkilö</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(progressPercentage)}%</Text>
              <Text style={styles.statLabel}>Tavoitteesta</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(remainingKm).toLocaleString('fi-FI')}</Text>
              <Text style={styles.statLabel}>km jäljellä</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{daysRemaining}</Text>
              <Text style={styles.statLabel}>päivää jäljellä</Text>
            </View>
          </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
})