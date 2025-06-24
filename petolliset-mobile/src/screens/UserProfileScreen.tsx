// src/screens/UserProfileScreen.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert, RefreshControl } from 'react-native';
import { Text, Card, FAB, List, Button, Avatar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useUser } from '../hooks/useUser';
import { ActivityForm } from '../components/ActivityForm';
import { theme } from '../constants/theme';
import apiService from '../services/apiService';

export default function UserProfileScreen() {
  const route = useRoute();
  const { username } = route.params as { username: string };
  const { user, loading, error, refetch } = useUser(username);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDeleteActivity = async (activityId: number, activityName: string) => {
    Alert.alert(
      'Poista suoritus',
      `Haluatko varmasti poistaa suorituksen "${activityName}"?`,
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteActivity(username, activityId);
              refetch();
            } catch (error) {
              Alert.alert('Virhe', 'Suorituksen poistaminen epäonnistui');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  const getBonusText = (bonus: string | null) => {
    if (!bonus) return '';
    switch (bonus) {
      case 'juhlapäivä':
        return ' (2x km)';
      case 'enemmän kuin kolme urheilee yhdessä':
        return ' (1.5x km)';
      case 'kaikki yhdessä':
        return ' (3x km)';
      default:
        return '';
    }
  };

  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ladataan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virhe: {error}</Text>
        <Button onPress={refetch}>Yritä uudelleen</Button>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Käyttäjää ei löytynyt</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        {/* User Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Image
              size={80}
              source={{
                uri: user.profilePicture
                  ? `https://matka-xi.vercel.app/${user.username}.png`
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
              }}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.totalKm}>
                {Math.round(user.totalKm)} km
              </Text>
              <Text style={styles.activityCount}>
                {user.activities.length} suoritusta
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Add Activity Form */}
        {showAddForm && (
          <ActivityForm
            username={username}
            onActivityAdded={() => {
              setShowAddForm(false);
              refetch();
            }}
          />
        )}

        {/* Activities List */}
        <Card style={styles.activitiesCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Suoritukset</Text>
            {user.activities.length === 0 ? (
              <Text style={styles.noActivities}>
                Ei suorituksia vielä
              </Text>
            ) : (
              user.activities
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((activity) => (
                  <List.Item
                    key={activity.id}
                    title={activity.activity}
                    description={`${activity.kilometers.toFixed(1)} km • ${activity.duration} min • ${formatDate(activity.date)}${getBonusText(activity.bonus ?? null)}`}
                    right={() => (
                      <View style={styles.activityActions}>
                        <Button
                          mode="text"
                          onPress={() => handleDeleteActivity(activity.id, activity.activity)}
                          textColor={theme.colors.error}
                          compact
                        >
                          Poista
                        </Button>
                      </View>
                    )}
                    style={styles.activityItem}
                  />
                ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddForm(!showAddForm)}
        label={showAddForm ? "Peruuta" : "Lisää"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: theme.spacing.lg,
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalKm: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  activityCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  activitiesCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  noActivities: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginTop: theme.spacing.lg,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityActions: {
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});