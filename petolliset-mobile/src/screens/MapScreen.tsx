// src/screens/MapScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { theme } from '../constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>🗺️ Kartta</Text>
          <Text style={styles.subtitle}>
            Karttanäkymä tulee tähän. Voit integroida sen myöhemmin.
          </Text>
          <Text style={styles.description}>
            Tässä näkymässä näkyisi:
            {'\n'}• Reitti maailman ympäri
            {'\n'}• Nykyinen sijainti
            {'\n'}• Saavutetut kaupungit
            {'\n'}• Edistyminen reitillä
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  card: {
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