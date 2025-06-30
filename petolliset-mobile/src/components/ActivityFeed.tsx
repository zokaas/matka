// src/components/ActivityFeed.tsx - Enhanced with new theme and better interactions
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Chip, Avatar, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
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
      month: 'short',
    });
  };

  const getBonusInfo = (bonus: string | null | undefined) => {
    if (!bonus) return null;
    
    const bonusMap = {
      'juhlapäivä': { text: '2x', icon: 'calendar', color: theme.colors.accent },
      'enemmän kuin kolme urheilee yhdessä': { text: '1.5x', icon: 'people', color: theme.colors.secondary },
      'kaikki yhdessä': { text: '3x', icon: 'heart', color: theme.colors.error },
    };
    
    return bonusMap[bonus as keyof typeof bonusMap] || { text: bonus, icon: 'star', color: theme.colors.primary };
  };

  const getActivityIcon = (activity: string) => {
    const iconMap: Record<string, string> = {
      'Juoksu': 'walk',
      'Sali': 'barbell',
      'Tennis': 'tennisball',
      'Pyöräily': 'bicycle',
      'Hiihto': 'snow',
      'Uinti': 'water',
      'Crossfit': 'fitness',
      'Spinning': 'bicycle',
      'Jooga': 'leaf',
      'Golf': 'golf',
      'Jalkapallo': 'football',
    };
    
    return iconMap[activity] || 'fitness';
  };

  const handleCelebrate = (username: string, activity: string) => {
    const celebrations = [
      `Mahtavaa ${username}! 🔥`,
      `Hienoa työtä ${username}! 💪`,
      `Loistavaa ${username}! ⭐`,
      `Erinomaista ${username}! 🚀`,
    ];
    
    const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
    Alert.alert('Kannustus lähetetty!', randomCelebration);
  };

  const renderActivity = ({ item, index }: { item: ActivityWithUser; index: number }) => {
    const bonusInfo = getBonusInfo(item.bonus);
    const activityIcon = getActivityIcon(item.activity);
    
    return (
      <Card style={[styles.activityCard, { marginTop: index === 0 ? theme.spacing.md : 0 }]}>
        <Card.Content style={styles.cardContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userSection}>
              <Avatar.Image
                size={48}
                source={{
                  uri: item.profilePicture
                    ? `https://matka-xi.vercel.app/${item.username}.png`
                    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.username}`,
                }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
                  <Text style={styles.time}>{formatDate(item.date)}</Text>
                </View>
              </View>
            </View>
            
            <IconButton
              icon="heart-outline"
              size={20}
              iconColor={theme.colors.primary}
              onPress={() => handleCelebrate(item.username, item.activity)}
            />
          </View>

          {/* Activity Details */}
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <View style={styles.activityIconContainer}>
                <Ionicons 
                  name={activityIcon as any} 
                  size={20} 
                  color={theme.colors.primary} 
                />
              </View>
              <Text style={styles.activityName}>{item.activity}</Text>
            </View>
            
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.kilometers.toFixed(1)}</Text>
                <Text style={styles.statLabel}>km</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.duration}</Text>
                <Text style={styles.statLabel}>min</Text>
              </View>
              
              {bonusInfo && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.bonusContainer}>
                    <Chip
                      mode="outlined"
                      compact
                      icon={bonusInfo.icon}
                      textStyle={[styles.bonusText, { color: bonusInfo.color }]}
                      style={[styles.bonusChip, { borderColor: bonusInfo.color }]}
                    >
                      {bonusInfo.text}
                    </Chip>
                  </View>
                </>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Ionicons name="fitness-outline" size={64} color={theme.colors.textMuted} />
        <Text style={styles.emptyTitle}>Ei suorituksia vielä</Text>
        <Text style={styles.emptyText}>
          Kun joku lisää suorituksen, se näkyy täällä
        </Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.feedHeader}>
      <View style={styles.feedTitleContainer}>
        <Ionicons name="flash" size={24} color={theme.colors.primary} />
        <Text style={styles.feedTitle}>Viimeisimmät suoritukset</Text>
      </View>
      <Text style={styles.feedSubtitle}>Kannustakaa toisianne! 💪</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Card style={styles.errorCard}>
          <Card.Content style={styles.errorContent}>
            <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
            <Text style={styles.errorTitle}>Virhe lataamisessa</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Button 
              mode="contained" 
              onPress={fetchActivities} 
              style={styles.retryButton}
              buttonColor={theme.colors.primary}
            >
              Yritä uudelleen
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => `${item.username}-${item.id}`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={fetchActivities}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={[
          styles.listContainer,
          activities.length === 0 && styles.emptyListContainer
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  feedHeader: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  feedTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  feedTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: '700',
  },
  feedSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  userInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  username: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  time: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    marginLeft: 4,
  },
  activitySection: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  activityName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  bonusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bonusChip: {
    backgroundColor: 'transparent',
  },
  bonusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 250,
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorCard: {
    width: '100%',
    maxWidth: 300,
    ...theme.shadows.lg,
  },
  errorContent: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
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
});