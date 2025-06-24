// src/screens/InsightsScreen.tsx - Updated with real insights functionality
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Card, SegmentedButtons } from 'react-native-paper';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { useWeeklyProgress } from '../hooks/useWeeklyProgress';
import { OverviewStats } from '../components/OverviewStats';
import { PopularSports } from '../components/PopularSports';
import { WeeklyInsights } from '../components/WeeklyInsights';
import { TopPerformers } from '../components/TopPerformers';
import { theme } from '../constants/theme';

export default function InsightsScreen() {
  const { users, totalKm, loading, error } = useFetchUsers();
  const { weeklyInsights } = useWeeklyProgress(users);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Ladataan tilastoja...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virhe: {error}</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'weekly':
        return (
          <>
            <WeeklyInsights weeklyInsights={weeklyInsights} />
            <TopPerformers weeklyInsights={weeklyInsights} />
          </>
        );
      case 'sports':
        return <PopularSports users={users} />;
      default:
        return <OverviewStats users={users} totalKm={totalKm} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📊 Tilastot</Text>
        
        <Card style={styles.tabCard}>
          <Card.Content>
            <SegmentedButtons
              value={activeTab}
              onValueChange={setActiveTab}
              buttons={[
                { value: 'overview', label: 'Yleiskuva' },
                { value: 'weekly', label: 'Viikko' },
                { value: 'sports', label: 'Lajit' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    color: theme.colors.text,
  },
  tabCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  segmentedButtons: {
    marginVertical: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});