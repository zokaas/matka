// src/components/ActivityFeed.tsx - Activity feed for mobile app
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { ActivityWithUser } from '../types/types';
import { theme } from '../constants/theme';
import apiService from '../services/apiService';

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try the new recent activities endpoint first
      try {
        const recentActivities = await apiService.activity.getRecentActivities(20);
        setActivities(recentActivities.map(activity => ({
          ...activity,
          username: activity.username || 'Unknown',
          profilePicture: activity.profilePicture,
        })));
      } catch (recentError) {
        // Fallback to fetching from all users
        const users = await apiService.user.getAllUsers();
        const allActivities: ActivityWithUser[] = [];

        for (const user of users) {
          try {
            const userActivities = await apiService.user.getUserActivities(user.username);
            userActivities.forEach(activity => {
              allActivities.push({
                ...activity,
                username: user.username,
                profilePicture: user.profilePicture,
              });
            });
          } catch (userError) {
            console.warn(`Failed to fetch activities for ${user.username}:`, userError);
          }
        }

        // Sort by date and take the most recent 20
        const sortedActivities = allActivities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 20);

        setActivities(sortedActivities);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Virhe suoritusten lataamisessa');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  const getBonusText = (bonus: string | null | undefined) => {
    if (!bonus) return null;
    switch (bonus) {
      case 'juhlapäivä':
        return '2x km';
      case 'enemmän kuin kolme urheilee yhdessä':
        return '1.5x km';
      case 'kaikki yhdessä':
        return '3x km';
      default:
        return bonus;
    }
  };

  const renderActivity = ({ item }: { item: ActivityWithUser }) => (
    <Card style={styles.activityCard}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: item.profilePicture
                  ? `https://matka-xi.vercel.app/${item.username}.png`
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.username}`,
              }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.activityDetails}>
          <Text style={styles.activityName}>{item.activity}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>{item.kilometers.toFixed(1)} km</Text>
            <Text style={styles.stat}>{item.duration} min</Text>
            {item.bonus && (
              <Chip
                mode="outlined"
                compact
                textStyle={styles.bonusText}
                style={styles.bonusChip}
              >
                🎉 {getBonusText(item.bonus)}
              </Chip>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchActivities} style={styles.retryButton}>
          Yritä uudelleen
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viimeisimmät suoritukset</Text>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => `${item.username}-${item.id}`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchActivities} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Ladataan suorituksia...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Ei suorituksia saatavilla</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  activityDetails: {
    marginTop: theme.spacing.sm,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  bonusChip: {
    backgroundColor: theme.colors.primaryLight,
    marginLeft: theme.spacing.sm,
  },
  bonusText: {
    fontSize: 12,
    color: theme.colors.primary,
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
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});