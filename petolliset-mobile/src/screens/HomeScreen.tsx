// Updated src/screens/HomeScreen.tsx - Add WeeklyProgressBar
import React, { useState } from 'react';
import { ScrollView, StyleSheet, RefreshControl, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { useWeeklyProgress } from '../hooks/useWeeklyProgress';
import { ProgressCard } from '../components/ProgressCard';
import { Leaderboard } from '../components/Leaderboard';
import { WeeklyProgressCard } from '../components/WeeklyProgressCard';
import { WeeklyProgressBar } from '../components/WeeklyProgressBar';
import { QuoteCard } from '../components/QuoteCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { theme } from '../constants/theme';

export default function HomeScreen() {
  const { users, totalKm, loading, error, refetch } = useFetchUsers();
  const { weeklyInsights } = useWeeklyProgress(users);
  const [activeView, setActiveView] = useState<'home' | 'feed' | 'weekly'>('home');

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virhe: {error}</Text>
        <Button mode="contained" onPress={refetch} style={styles.retryButton}>
          Yritä uudelleen
        </Button>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'feed':
        return <ActivityFeed />;
      case 'weekly':
        return <WeeklyProgressCard weeklyInsights={weeklyInsights} />;
      default:
        return (
          <>
            <ProgressCard totalKm={totalKm} />
            <WeeklyProgressBar users={users} />
            <QuoteCard />
            <Leaderboard users={users} />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>🌍 MAAILMAN YMPÄRI 🌍</Text>
        <Text style={styles.subtitle}>PETOLLISET🔥</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabButtons}>
          {[
            { key: 'home', label: 'Sijoitukset' },
            { key: 'weekly', label: 'Viikon tilanne' },
            { key: 'feed', label: 'Kannustus' },
          ].map((tab) => (
            <Button
              key={tab.key}
              mode={activeView === tab.key ? 'contained' : 'outlined'}
              onPress={() => setActiveView(tab.key as any)}
              style={[
                styles.tabButton,
                activeView === tab.key && styles.activeTabButton,
              ]}
              labelStyle={[
                styles.tabButtonText,
                activeView === tab.key && styles.activeTabButtonText,
              ]}
              buttonColor={activeView === tab.key ? theme.colors.primary : 'transparent'}
              textColor={activeView === tab.key ? '#fff' : theme.colors.textSecondary}
              compact
            >
              {tab.label}
            </Button>
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
        {renderContent()}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
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
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  tabContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  activeTabButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabButtonText: {
    fontWeight: '600',
  },
});