// src/components/PersonalInsights.tsx - Personal insights for user profiles
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, SegmentedButtons, List } from 'react-native-paper';
import { Activity } from '../types/types';
import { theme } from '../constants/theme';
import { getActivityStreak, getTotalKilometers, getTotalDuration, getMostPopularActivity } from '../utils/activityUtils';

interface PersonalInsightsProps {
  activities: Activity[];
  username: string;
}

export const PersonalInsights: React.FC<PersonalInsightsProps> = ({ activities, username }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate insights
  const totalActivities = activities.length;
  const totalKilometers = getTotalKilometers(activities);
  const totalDuration = getTotalDuration(activities);
  const averageDuration = totalActivities > 0 ? totalDuration / totalActivities : 0;
  const mostPopularActivity = getMostPopularActivity(activities);
  const currentStreak = getActivityStreak(activities);

  // Calculate weeks covered
  const firstDate = activities.length > 0 ? new Date(activities[activities.length - 1].date) : new Date();
  const lastDate = activities.length > 0 ? new Date(activities[0].date) : new Date();
  const weeksCovered = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  const avgWeeklyKm = totalKilometers / weeksCovered;

  // Activity breakdown
  const activityCounts = activities.reduce((acc, activity) => {
    acc[activity.activity] = (acc[activity.activity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activityBreakdown = Object.entries(activityCounts)
    .map(([activity, count]) => ({
      activity,
      count,
      percentage: Math.round((count / totalActivities) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (totalActivities === 0) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Omat tilastot</Title>
            <Text style={styles.noDataText}>
              Lisää suorituksia nähdäksesi tilastot
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalActivities}</Text>
          <Text style={styles.statLabel}>Suoritukset</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{(totalDuration / 60).toFixed(1)} h</Text>
          <Text style={styles.statLabel}>Tunnit</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(totalKilometers)} km</Text>
          <Text style={styles.statLabel}>Kilometrit</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(avgWeeklyKm)} km</Text>
          <Text style={styles.statLabel}>Viikko ka</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStreak} pv</Text>
          <Text style={styles.statLabel}>Nykyinen putki</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(averageDuration)} min</Text>
          <Text style={styles.statLabel}>Keskim. kesto</Text>
        </View>
      </View>

      <Card style={styles.favoriteCard}>
        <Card.Content>
          <Title style={styles.favoriteTitle}>Suosituin laji</Title>
          <Text style={styles.favoriteActivity}>
            {mostPopularActivity || 'Ei tietoja'}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  const renderActivity = () => (
    <View style={styles.tabContent}>
      <Card style={styles.breakdownCard}>
        <Card.Content>
          <Title style={styles.breakdownTitle}>Aktiviteettijakauma</Title>
          {activityBreakdown.map((item) => (
            <List.Item
              key={item.activity}
              title={item.activity}
              description={`${item.count} kertaa (${item.percentage}%)`}
              style={styles.breakdownItem}
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Omat tilastot</Title>
          
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              { value: 'overview', label: 'Yleiskuva' },
              { value: 'activity', label: 'Lajit' },
            ]}
            style={styles.segmentedButtons}
          />

          {activeTab === 'overview' ? renderOverview() : renderActivity()}
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
  segmentedButtons: {
    marginBottom: theme.spacing.md,
  },
  tabContent: {
    marginTop: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    width: '30%',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  favoriteCard: {
    backgroundColor: theme.colors.primaryLight,
  },
  favoriteTitle: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  favoriteActivity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  breakdownCard: {
    marginTop: theme.spacing.sm,
  },
  breakdownTitle: {
    fontSize: 16,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  breakdownItem: {
    paddingVertical: theme.spacing.xs,
  },
  noDataText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginTop: theme.spacing.lg,
  },
});