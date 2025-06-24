// src/screens/HomeScreen.tsx - Updated to match web app functionality
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, RefreshControl, View, Text } from 'react-native';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { useWeeklyProgress } from '../hooks/useWeeklyProgress';
import { ProgressCard } from '../components/ProgressCard';
import { Leaderboard } from '../components/Leaderboard';
import { WeeklyProgressCard } from '../components/WeeklyProgressCard';
import { QuoteCard } from '../components/QuoteCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { theme } from '../constants/theme';

export default function HomeScreen() {
  const { users, totalKm, loading, error, refetch } = useFetchUsers();
  const { weeklyInsights } = useWeeklyProgress(users);
  const [activeTab, setActiveTab] = useState('home');

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virhe: {error}</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return <ActivityFeed />;
      case 'weekly':
        return <WeeklyProgressCard weeklyInsights={weeklyInsights} />;
      default:
        return (
          <>
            <ProgressCard totalKm={totalKm} />
            <QuoteCard />
            <Leaderboard users={users} />
            <WeeklyProgressCard weeklyInsights={weeklyInsights} />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabButtons}>
          {[
            { key: 'home', label: 'Etusivu' },
            { key: 'weekly', label: 'Viikon tilanne' },
            { key: 'feed', label: 'Suoritukset' },
          ].map((tab) => (
            <Text
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
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
  tabContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  tabButton: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    fontWeight: '600',
  },
});