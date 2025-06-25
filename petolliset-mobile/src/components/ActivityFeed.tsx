// src/components/ActivityFeed.tsx - Enhanced with better styling
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Button, Chip, Avatar } from 'react-native-paper';
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

      const recentActivities = await apiService.getRecentActivities(20);
      setActivities(recentActivities);
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Eilen';
    if (diffDays === 0) return 'Tänään';
    if (diffDays <= 7) return `${diffDays} päivää sitten`;
    
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'numeric',
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
            <Avatar.Image
              size={40}
              source={{
                uri: item.profilePicture
                  ? `https://matka-xi.vercel.app/${item.username}.png`
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.username}`,
              }}
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
            <View style={styles.statBadge}>
              <Text style={styles.statText}>{item.kilometers.toFixed(1)} km</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statText}>{item.duration} min</Text>
            </View>
            {item.bonus && (
              <Chip
                mode="outlined"
                compact
                textStyle={styles.bonusText}
                style={styles.bonusChip}
                icon="star"
              >
                {getBonusText(item.bonus)}
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>💪 Viimeisimmät suoritukset</Text>
        <Text style={styles.subtitle}>Kannustakaa toisianne!</Text>
      </View>
      
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
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  activityCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
    borderRadius: theme.borderRadius.lg,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: theme.spacing.sm,
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
    marginBottom: theme.spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  bonusChip: {
    backgroundColor: theme.colors.primaryLight,
    marginLeft: theme.spacing.sm,
  },
  bonusText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
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