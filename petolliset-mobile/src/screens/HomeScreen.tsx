// src/screens/HomeScreen.tsx - Enhanced with better UI and no map
import React, { useState } from 'react';
import { ScrollView, StyleSheet, RefreshControl, View, Text } from 'react-native';
import { Button, Card, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { useWeeklyProgress } from '../hooks/useWeeklyProgress';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();
  const navigation = useNavigation();
  const [activeView, setActiveView] = useState<'home' | 'feed' | 'weekly'>('home');

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={styles.errorTitle}>Oops! Jotain meni pieleen</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={refetch} 
            style={styles.retryButton}
            buttonColor={theme.colors.primary}
          >
            Yritä uudelleen
          </Button>
        </View>
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
          <ScrollView
            style={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
            showsVerticalScrollIndicator={false}
          >
            <ProgressCard totalKm={totalKm} />
            <WeeklyProgressBar users={users} />
            <QuoteCard />
            <Leaderboard users={users} />
          </ScrollView>
        );
    }
  };

  const goToAddActivity = () => {
    navigation.navigate('Add' as never);
  };

  return (
    <View style={styles.container}>
      {/* Header with modern gradient */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="fitness" size={32} color="#fff" />
            <View style={styles.logoText}>
              <Text style={styles.logo}>Petolliset</Text>
              <Text style={styles.subtitle}>Maailman ympäri 🌍</Text>
            </View>
          </View>
          
          {user && (
            <View style={styles.userGreeting}>
              <Text style={styles.greetingText}>Hei, {user.username}! 👋</Text>
            </View>
          )}
        </View>
      </View>

      {/* Enhanced Tab Navigation */}
      <Card style={styles.tabCard}>
        <Card.Content style={styles.tabContainer}>
          <View style={styles.tabButtons}>
            {[
              { key: 'home', label: 'Kotinäkymä', icon: 'home' },
              { key: 'weekly', label: 'Viikon tilanne', icon: 'calendar' },
              { key: 'feed', label: 'Aktiviteetti', icon: 'chatbubbles' },
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
                icon={tab.icon}
              >
                {tab.label}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Quick Action FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={goToAddActivity}
        label="Lisää suoritus"
        variant="primary"
        color={theme.colors.textOnPrimary}
      />
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: theme.spacing.md,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  userGreeting: {
    alignItems: 'flex-end',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tabCard: {
    margin: theme.spacing.md,
    marginTop: -theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  tabContainer: {
    padding: theme.spacing.sm,
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  activeTabButton: {
    ...theme.shadows.sm,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabButtonText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
  errorCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  errorTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  });