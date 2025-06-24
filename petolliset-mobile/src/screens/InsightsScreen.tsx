// src/screens/InsightsScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { theme } from '../constants/theme';

export default function InsightsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>📊 Tilastot</Text>
          <Text style={styles.subtitle}>
            Yksityiskohtaiset tilastot tulevat tähän
          </Text>
          <Text style={styles.description}>
            Tässä näkymässä näkyisi:
            {'\n'}• Kaikkien aikojen tilastot
            {'\n'}• Viikkotilastot
            {'\n'}• Suosituimmat lajit
            {'\n'}• Edistymiskaaviot
            {'\n'}• Ennätykset
            {'\n'}• Tavoiteseuranta
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
  },
});

