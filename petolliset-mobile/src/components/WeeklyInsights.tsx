
// src/components/WeeklyInsights.tsx - Weekly insights table
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, ProgressBar, DataTable } from 'react-native-paper';
import { WeeklyInsight } from '../types/types';
import { theme } from '../constants/theme';

interface WeeklyInsightsProps {
  weeklyInsights: WeeklyInsight[];
}

export const WeeklyInsights: React.FC<WeeklyInsightsProps> = ({ weeklyInsights }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Kuluvan viikon statsit</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.nameColumn}>Nimi</DataTable.Title>
                <DataTable.Title style={styles.progressColumn}>Viikon edistyminen</DataTable.Title>
                <DataTable.Title style={styles.targetColumn}>Päivätavoite</DataTable.Title>
              </DataTable.Header>

              {weeklyInsights.map((user) => (
                <DataTable.Row key={user.username}>
                  <DataTable.Cell style={styles.nameColumn}>
                    <Text style={styles.username}>{user.username}</Text>
                  </DataTable.Cell>
                  
                  <DataTable.Cell style={styles.progressColumn}>
                    <View style={styles.progressContainer}>
                      <ProgressBar
                        progress={user.weeklyPercentage / 100}
                        color={theme.colors.primary}
                        style={styles.progressBar}
                      />
                      <Text style={styles.progressText}>
                        {user.weeklyProgress} km ({user.weeklyPercentage}%)
                      </Text>
                    </View>
                  </DataTable.Cell>
                  
                  <DataTable.Cell style={styles.targetColumn}>
                    <Text style={styles.targetText}>
                      {user.dailyTarget.toFixed(1)} km
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  nameColumn: {
    flex: 1,
    minWidth: 100,
  },
  progressColumn: {
    flex: 2,
    minWidth: 150,
  },
  targetColumn: {
    flex: 1,
    minWidth: 80,
  },
  username: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: theme.spacing.xs,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  targetText: {
    fontSize: 12,
    color: theme.colors.text,
  },
});