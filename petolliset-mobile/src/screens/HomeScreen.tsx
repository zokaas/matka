import React from 'react';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { useWeeklyProgress } from '../hooks/useWeeklyProgress';
import { ProgressCard } from '../components/ProgressCard';
import { Leaderboard } from '../components/Leaderboard';
import { WeeklyProgressCard } from '../components/WeeklyProgressCard';
import { QuoteCard } from '../components/QuoteCard';
import { theme } from '../constants/theme';

export default function HomeScreen() {
  const { users, totalKm, loading, error, refetch } = useFetchUsers();
  const { weeklyInsights } = useWeeklyProgress(users);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virhe: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <ProgressCard totalKm={totalKm} />
      <QuoteCard />
      <Leaderboard users={users} />
      <WeeklyProgressCard weeklyInsights={weeklyInsights} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});