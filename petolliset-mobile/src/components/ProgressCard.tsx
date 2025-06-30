// src/components/ProgressCard.tsx - Enhanced with new theme and animations
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme, getProgressColor } from '../constants/theme';

interface ProgressCardProps {
  totalKm: number;
  targetKm?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ 
  totalKm, 
  targetKm = 100000 
}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const progressPercentage = Math.min(totalKm / targetKm, 1);
  const progressPercent = Math.round(progressPercentage * 100);
  const remainingKm = Math.max(0, targetKm - totalKm);
  
  const formattedProgress = Math.round(totalKm).toLocaleString('fi-FI');
  const formattedTarget = targetKm.toLocaleString('fi-FI');
  const formattedRemaining = remainingKm.toLocaleString('fi-FI');

  // Animate progress on mount
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progressPercentage,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  const getProgressMessage = () => {
    if (progressPercent >= 100) return "🎉 Tavoite saavutettu!";
    if (progressPercent >= 90) return "🚀 Lähes perillä!";
    if (progressPercent >= 75) return "💪 Hyvää vauhtia!";
    if (progressPercent >= 50) return "⭐ Puoliväli ylitetty!";
    if (progressPercent >= 25) return "🔥 Hyvä alku!";
    return "🌱 Matka alkaa!";
  };

  const getProgressIcon = () => {
    if (progressPercent >= 90) return "rocket";
    if (progressPercent >= 75) return "trending-up";
    if (progressPercent >= 50) return "checkmark-circle";
    if (progressPercent >= 25) return "flame";
    return "leaf";
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="earth" size={24} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>🌍 MAAILMAN YMPÄRI 🌍</Text>
            <Text style={styles.subtitle}>Yhteinen matka kohti tavoitetta</Text>
          </View>
        </View>

        {/* Progress Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStat}>
            <Text style={styles.progressNumber}>{formattedProgress}</Text>
            <Text style={styles.progressUnit}>/ {formattedTarget} km</Text>
          </View>
          
          <View style={styles.percentageContainer}>
            <Ionicons 
              name={getProgressIcon()} 
              size={20} 
              color={getProgressColor(progressPercent)} 
            />
            <Text style={[styles.percentage, { color: getProgressColor(progressPercent) }]}>
              {progressPercent}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View style={styles.progressBarContainer}>
            <ProgressBar 
              progress={progressPercentage} 
              color={getProgressColor(progressPercent)}
              style={styles.progressBar}
            />
          </Animated.View>
          <Text style={styles.progressMessage}>{getProgressMessage()}</Text>
        </View>

        {/* Bottom Stats */}
        <View style={styles.bottomStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formattedRemaining}</Text>
            <Text style={styles.statLabel}>km jäljellä</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.round((targetKm - totalKm) / 30)}
            </Text>
            <Text style={styles.statLabel}>päivää jäljellä</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.lg,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...theme.typography.h3,
    color: '#fff',
    fontWeight: '800',
  },
  subtitle: {
    ...theme.typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  mainStat: {
    flex: 1,
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 36,
  },
  progressUnit: {
    ...theme.typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  percentage: {
    ...theme.typography.h4,
    fontWeight: '700',
    marginLeft: theme.spacing.xs,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressBarContainer: {
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressMessage: {
    ...theme.typography.bodyMedium,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...theme.typography.h4,
    color: '#fff',
    fontWeight: '700',
  },
  statLabel: {
    ...theme.typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: theme.spacing.md,
  },
});