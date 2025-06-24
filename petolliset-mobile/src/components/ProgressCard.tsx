
// src/components/ProgressCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Text, ProgressBar } from 'react-native-paper';
import { theme } from '../constants/theme';

interface ProgressCardProps {
  totalKm: number;
  targetKm?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ 
  totalKm, 
  targetKm = 100000 
}) => {
  const progressPercentage = Math.min(totalKm / targetKm, 1);
  const formattedProgress = Math.round(totalKm).toLocaleString('fi-FI');
  const formattedTarget = targetKm.toLocaleString('fi-FI');

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>🌍 MAAILMAN YMPÄRI 🌍</Title>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {formattedProgress} / {formattedTarget} km
          </Text>
          <Text style={styles.percentageText}>
            {Math.round(progressPercentage * 100)}%
          </Text>
        </View>
        <ProgressBar 
          progress={progressPercentage} 
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        <Text style={styles.remainingText}>
          {Math.round(targetKm - totalKm).toLocaleString('fi-FI')} km jäljellä
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  percentageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  remainingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.9,
  },
});
