// src/screens/AddActivityScreen.tsx - Enhanced with authentication context
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { ActivityForm } from '../components/ActivityForm';
import { theme } from '../constants/theme';

export default function AddActivityScreen() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.errorContainer}>
        <Card style={styles.errorCard}>
          <Card.Content style={styles.errorContent}>
            <Ionicons name="lock-closed" size={48} color={theme.colors.textMuted} />
            <Text style={styles.errorTitle}>Kirjautuminen vaaditaan</Text>
            <Text style={styles.errorText}>
              Sinun täytyy kirjautua sisään lisätäksesi suorituksia
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Lisää suoritus</Text>
            <Text style={styles.subtitle}>Tallenna uusi liikuntasuoritus</Text>
          </View>
        </View>
      </View>

      {/* User Info */}
      <Card style={styles.userCard}>
        <Card.Content style={styles.userContent}>
          <View style={styles.userInfo}>
            <Ionicons name="person" size={20} color={theme.colors.primary} />
            <Text style={styles.userText}>Lisätään käyttäjälle: {user.username}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Activity Form */}
      <ActivityForm 
        username={user.username} 
        onActivityAdded={() => {
          // Could add navigation or toast notification here
          console.log('Activity added successfully');
        }}
      />

      {/* Helper Text */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <Text style={styles.helpTitle}>💡 Vinkkejä</Text>
          <Text style={styles.helpText}>
            • Kilometrit lasketaan automaattisesti lajin ja keston perusteella{'\n'}
            • Voit lisätä bonuksia erityistilanteisiin{'\n'}
            • Kaikki suoritukset näkyvät yhteisessä syötteessä{'\n'}
            • Muokkaa suorituksia profiilisivulta
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
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  title: {
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
  userCard: {
    margin: theme.spacing.md,
    marginTop: -theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  userContent: {
    padding: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  helpCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  helpTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  helpText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
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
    textAlign: 'center',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});